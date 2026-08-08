import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { enrichFromWebsite, isWebsiteDown } from "@/lib/lead-enrich";

/**
 * Checks whether OSM search results' websites are reachable, before any of
 * them are saved as leads.
 *
 * This is deliberately not folded into the search itself (search-osm/route.ts):
 * `enrichFromWebsite` makes real outbound requests with an 8s timeout each,
 * and a typical search returns 20-30+ results with a website. Bundling that
 * into the search response risks stacking tens of seconds on top of an
 * Overpass call that can already take 25s+ under load, which is both a bad
 * wait for an admin who may only want the "no website" half of the results
 * anyway, and a real risk of blowing past the serverless function's time
 * budget. So it's a separate, on-demand, explicitly bounded action instead.
 *
 * No database writes here - these places don't have a Lead row yet. The
 * client holds the per-place result locally and, if the admin saves one of
 * these places afterward, forwards it in the save payload
 * (POST /api/admin/leads) to land in Lead.websiteUnreachable directly.
 */

/** Bounds the outbound fan-out of a single request. */
const MAX_PLACES_PER_REQUEST = 40;

/**
 * Enough to keep a bulk run from taking minutes, low enough to stay a polite
 * caller - these are small-business sites, often on shared hosting.
 */
const CONCURRENCY = 4;

interface CheckOutcome {
  placeId: string;
  unreachable: boolean;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await enforceRateLimit(
    req,
    "leadCheckWebsites",
    `user:${session.user.id}`
  );
  if (limited) return limited;

  const body = await req.json();
  const { places } = body as {
    places?: { placeId: string; website: string }[];
  };

  if (!places?.length) {
    return NextResponse.json({ error: "No places provided" }, { status: 400 });
  }

  if (places.length > MAX_PLACES_PER_REQUEST) {
    return NextResponse.json(
      { error: `Check at most ${MAX_PLACES_PER_REQUEST} websites at a time.` },
      { status: 400 }
    );
  }

  // A fixed pool of workers pulling from a shared cursor, so one slow site
  // doesn't hold up the rest the way a chunked Promise.all would.
  const toCheck = places;
  const results: CheckOutcome[] = [];
  let cursor = 0;

  async function worker() {
    while (cursor < toCheck.length) {
      const place = toCheck[cursor++];
      const result = await enrichFromWebsite(place.website);
      results.push({ placeId: place.placeId, unreachable: isWebsiteDown(result) });
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, toCheck.length) }, worker)
  );

  return NextResponse.json({ results });
}
