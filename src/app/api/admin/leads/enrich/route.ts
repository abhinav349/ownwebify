import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { enrichFromWebsite } from "@/lib/lead-enrich";

/**
 * Fills in missing contact details by reading each lead's own website.
 *
 * Neither lead source supplies an email address (Places has no such field,
 * OSM's tag is usually absent), so without this every outreach email needs
 * an address typed in by hand. See src/lib/lead-enrich.ts for how the
 * untrusted website URLs are fetched safely.
 */

/** Bounds the outbound fan-out of a single request. */
const MAX_LEADS_PER_REQUEST = 20;

/**
 * Enough to keep a bulk run from taking minutes, low enough to stay a polite
 * caller - these are small-business sites, often on shared hosting.
 */
const CONCURRENCY = 4;

interface EnrichOutcome {
  id: string;
  businessName: string;
  email: string | null;
  phone: string | null;
  websiteUnreachable: boolean | null;
  /** Absent on success; a human-readable reason otherwise. */
  error?: string;
}

async function enrichLead(lead: {
  id: string;
  businessName: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  websiteUnreachable: boolean | null;
}): Promise<EnrichOutcome> {
  const base = { id: lead.id, businessName: lead.businessName };

  if (!lead.website) {
    return {
      ...base,
      email: null,
      phone: null,
      websiteUnreachable: lead.websiteUnreachable,
      error: "No website on file",
    };
  }

  const result = await enrichFromWebsite(lead.website);

  if (!result.ok) {
    // Specifically "the site didn't answer", not "we chose not to trust it"
    // (invalid_url/not_html) or "we refused to fetch it" (blocked_host) -
    // only unreachable is evidence the business's own site is down, which is
    // the signal worth surfacing on the lead itself. A dead site is a
    // *stronger* prospect than no site at all: they already paid for one.
    const websiteUnreachable = result.reason === "unreachable" ? true : lead.websiteUnreachable;
    if (websiteUnreachable !== lead.websiteUnreachable) {
      await prisma.lead
        .update({
          where: { id: lead.id },
          data: { websiteUnreachable, websiteCheckedAt: new Date() },
        })
        .catch((err) => console.error("Lead enrich status update failed:", err));
    }
    return { ...base, email: null, phone: null, websiteUnreachable, error: result.message };
  }

  // Only ever fill gaps. An existing value was typed in by an admin or came
  // from the lead source, and both beat a guess scraped off a web page.
  const email = lead.email ?? result.email;
  const phone = lead.phone ?? result.phone;
  // The site answered, so any earlier "unreachable" flag is stale - clear it
  // rather than leaving a broken-website badge on a business that fixed it.
  const websiteUnreachable = false;

  try {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { email, phone, websiteUnreachable, websiteCheckedAt: new Date() },
    });
  } catch (err) {
    console.error("Lead enrich update failed:", err);
    return {
      ...base,
      email: lead.email,
      phone: lead.phone,
      websiteUnreachable: lead.websiteUnreachable,
      error: "Couldn't save the details found",
    };
  }

  if (email === lead.email && phone === lead.phone) {
    return {
      ...base,
      email: lead.email,
      phone: lead.phone,
      websiteUnreachable,
      error: result.email
        ? undefined
        : (result.note ?? "No contact details published on that site"),
    };
  }

  return { ...base, email, phone, websiteUnreachable };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await enforceRateLimit(
    req,
    "leadEnrich",
    `user:${session.user.id}`
  );
  if (limited) return limited;

  const body = await req.json();
  const { ids } = body as { ids?: string[] };

  if (!ids?.length) {
    return NextResponse.json({ error: "No leads provided" }, { status: 400 });
  }

  if (ids.length > MAX_LEADS_PER_REQUEST) {
    return NextResponse.json(
      { error: `Enrich at most ${MAX_LEADS_PER_REQUEST} leads at a time.` },
      { status: 400 }
    );
  }

  const leads = await prisma.lead.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      businessName: true,
      website: true,
      email: true,
      phone: true,
      websiteUnreachable: true,
    },
  });

  if (!leads.length) {
    return NextResponse.json({ error: "No matching leads found" }, { status: 404 });
  }

  // A fixed pool of workers pulling from a shared cursor, so one slow site
  // doesn't hold up the rest the way a chunked Promise.all would.
  const results: EnrichOutcome[] = [];
  let cursor = 0;

  async function worker() {
    while (cursor < leads.length) {
      const lead = leads[cursor++];
      results.push(await enrichLead(lead));
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, leads.length) }, worker)
  );

  return NextResponse.json({
    results,
    found: results.filter((r) => !r.error).length,
  });
}
