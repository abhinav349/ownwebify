import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, resetRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (
      !email ||
      !code ||
      typeof email !== "string" ||
      typeof code !== "string"
    ) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Throttling lives in Postgres rather than a module-level Map: this runs
    // on serverless functions, so an in-process counter only ever saw the
    // requests that happened to land on one instance and was wiped on every
    // cold start — which handed an attacker a fresh budget for free. The Map
    // also grew without bound, as nothing evicted stale entries.
    const normalizedEmail = email.toLowerCase();

    const limitedByEmail = await enforceRateLimit(
      request,
      "otpVerify",
      `email:${normalizedEmail}`
    );
    if (limitedByEmail) return limitedByEmail;

    const limitedByIp = await enforceRateLimit(request, "otpVerify");
    if (limitedByIp) return limitedByIp;

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
    await resetRateLimit("otpVerify", `email:${normalizedEmail}`);

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
