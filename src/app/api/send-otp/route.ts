import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, otpEmailHtml } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rate-limit";
import { generateOtpCode } from "@/lib/password";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    // The per-email cap below stops one address being spammed, but on its
    // own it lets a caller send unlimited mail by rotating the address —
    // every send costs money and burns sender reputation. Cap the source
    // too.
    const limitedByIp = await enforceRateLimit(request, "otpSend");
    if (limitedByIp) return limitedByIp;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCodes = await prisma.otpCode.count({
      where: { email, createdAt: { gte: oneHourAgo } },
    });

    if (recentCodes >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: { email, code, expiresAt },
    });

    const result = await sendEmail({
      to: email,
      subject: "Your OwnWebify Verification Code",
      html: otpEmailHtml(code),
    });

    if (!result.success) {
      console.error("OTP email failed:", JSON.stringify(result));
      if (process.env.RESEND_API_KEY) {
        return NextResponse.json(
          { error: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, emailSent: result.success });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
