import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, leadOutreachEmailHtml } from "@/lib/email";
import { getLeadTemplate } from "@/lib/lead-templates";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await req.json()) as { id: string };

  if (!id) {
    return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id } });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  if (!lead.email) {
    return NextResponse.json(
      { error: "This lead has no email address on file" },
      { status: 400 }
    );
  }

  const template = getLeadTemplate(lead.businessName, lead.category);

  const result = await sendEmail({
    to: lead.email,
    subject: template.subject,
    html: leadOutreachEmailHtml(template.emailBody),
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to send email" },
      { status: 502 }
    );
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: { emailSentAt: new Date() },
  });

  return NextResponse.json({ lead: updated });
}
