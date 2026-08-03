import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { MIN_PASSWORD_LENGTH } from "@/lib/validations";
import { BCRYPT_COST } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    // Redeems a setup token straight into a password. Throttled so the
    // token space cannot be probed.
    const limited = await enforceRateLimit(request, "setupAccount");
    if (limited) return limited;

    const { token, password } = await request.json();

    if (
      !token ||
      typeof token !== "string" ||
      !password ||
      typeof password !== "string" ||
      password.length < MIN_PASSWORD_LENGTH
    ) {
      return NextResponse.json(
        {
          error: `Token and a password (min ${MIN_PASSWORD_LENGTH} chars) are required.`,
        },
        { status: 400 }
      );
    }

    const setupToken = await prisma.setupToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, passwordHash: true } } },
    });

    if (!setupToken || setupToken.used || setupToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This link has expired or already been used." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: setupToken.userId },
        data: { passwordHash: hashedPassword, emailVerified: true },
      }),
      prisma.setupToken.update({
        where: { id: setupToken.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Setup account error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
