import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

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

  // Rate limit: max 3 reset requests per hour per email
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentTokens = await prisma.passwordResetToken.count({
    where: { email, createdAt: { gte: oneHourAgo } },
  });

  if (recentTokens >= 3) {
    return NextResponse.json({ success: true });
  }

  // Invalidate previous tokens
  await prisma.passwordResetToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset Your Password - OwnWebify",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
