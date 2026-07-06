import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const verifyAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Rate limit: max 5 verification attempts per email per 15 minutes
    const key = email.toLowerCase();
    const now = Date.now();
    const attempt = verifyAttempts.get(key);
    if (attempt) {
      if (now - attempt.lastAttempt < 15 * 60 * 1000 && attempt.count >= 5) {
        return NextResponse.json(
          { error: "Too many attempts. Please request a new code." },
          { status: 429 }
        );
      }
      if (now - attempt.lastAttempt >= 15 * 60 * 1000) {
        verifyAttempts.set(key, { count: 1, lastAttempt: now });
      } else {
        attempt.count++;
        attempt.lastAttempt = now;
      }
    } else {
      verifyAttempts.set(key, { count: 1, lastAttempt: now });
    }

    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        verified: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Clear attempts on success
    verifyAttempts.delete(key);

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
