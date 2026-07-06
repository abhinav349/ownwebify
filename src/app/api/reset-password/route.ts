import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { email, otp, newPassword } = await request.json();

  if (!email || !otp || !newPassword) {
    return NextResponse.json(
      { error: "Email, OTP, and new password are required" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
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

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    }),
  ]);

  return NextResponse.json({ success: true });
}
