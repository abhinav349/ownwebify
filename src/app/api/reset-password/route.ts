import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { enforceRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { MIN_PASSWORD_LENGTH } from "@/lib/validations";
import { BCRYPT_COST } from "@/lib/password";

export async function POST(request: NextRequest) {
  const { email, otp, newPassword } = await request.json();

  if (!email || !otp || !newPassword) {
    return NextResponse.json(
      { error: "Email, OTP, and new password are required" },
      { status: 400 }
    );
  }

  if (
    typeof email !== "string" ||
    typeof otp !== "string" ||
    typeof newPassword !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // This endpoint takes a 6-digit OTP and hands back control of an account
  // on a match, so it is a brute-force target in its own right — the OTP
  // never has to pass through /api/verify-otp first. Unthrottled, the whole
  // 1e6 keyspace is walkable well inside the code's 10-minute lifetime.
  // Limit per-account and per-IP so neither a single target nor a single
  // attacker can grind.
  const normalizedEmail = email.toLowerCase();

  const limitedByEmail = await enforceRateLimit(
    request,
    "passwordReset",
    `email:${normalizedEmail}`
  );
  if (limitedByEmail) return limitedByEmail;

  const limitedByIp = await enforceRateLimit(request, "passwordReset");
  if (limitedByIp) return limitedByIp;

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
  }

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email,
      code: otp,
      verified: false,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    return NextResponse.json(
      { error: "Invalid or expired OTP. Please request a new one." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    // Burn every outstanding code for this address, not just the one that
    // was redeemed — otherwise a second live code remains a working reset
    // path after the password has already changed.
    prisma.otpCode.updateMany({
      where: { email, verified: false },
      data: { verified: true },
    }),
  ]);

  // Credential is settled; don't leave the legitimate owner throttled.
  await resetRateLimit("passwordReset", `email:${normalizedEmail}`);

  return NextResponse.json({ success: true });
}
