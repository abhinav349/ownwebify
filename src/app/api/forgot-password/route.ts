import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, otpEmailHtml } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rate-limit";
import { generateOtpCode } from "@/lib/password";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Per-IP cap: the per-email cap further down is keyed on the address, so
  // rotating addresses otherwise gives an unlimited outbound mail budget.
  const limitedByIp = await enforceRateLimit(request, "otpSend");
  if (limitedByIp) return limitedByIp;

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

  const code = generateOtpCode();
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
