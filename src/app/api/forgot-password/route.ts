import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, otpEmailHtml } from "@/lib/email";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user || !user.passwordHash) {
    return NextResponse.json({ success: true });
  }

  // Rate limit: max 3 OTP requests per hour per email
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCodes = await prisma.otpCode.count({
    where: { email, createdAt: { gte: oneHourAgo } },
  });

  if (recentCodes >= 3) {
    return NextResponse.json({ success: true });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.otpCode.create({
    data: { email, code, expiresAt },
  });

  await sendEmail({
    to: email,
    subject: "Password Reset OTP - OwnWebify",
    html: otpEmailHtml(code),
  });

  return NextResponse.json({ success: true });
}
