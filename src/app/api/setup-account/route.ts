import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Token and a password (min 6 chars) are required." },
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

    const hashedPassword = await bcrypt.hash(password, 10);

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
