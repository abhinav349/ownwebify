import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { projectIntakeSchema } from "@/lib/validations";
import { sendEmail, newProjectEmailHtml } from "@/lib/email";
import { referralRewardUSD } from "@/lib/pricing";

function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, "X");
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = projectIntakeSchema.parse(body);

    let user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    const isNewUser = !user;

    if (!user) {
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const referralCode = generateReferralCode(validatedData.name);
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          company: validatedData.company || null,
          passwordHash: hashedPassword,
          role: "CLIENT",
          referralCode,
        },
      });
    }

    // Process referral code if provided and user is new
    if (validatedData.referralCode && isNewUser) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: validatedData.referralCode },
      });

      if (referrer && referrer.id !== user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { referredById: referrer.id },
        });

        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            refereeId: user.id,
            amount: referralRewardUSD,
            status: "CREDITED",
          },
        });

        await prisma.user.update({
          where: { id: referrer.id },
          data: { referralBalance: { increment: referralRewardUSD } },
        });
      }
    }

    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        projectType: validatedData.projectType,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        referenceLinks: validatedData.referenceLinks || null,
        howFoundUs: validatedData.howFoundUs || null,
        clientId: user.id,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Project Request: ${project.title}`,
        html: newProjectEmailHtml(project.title, user.name, user.email),
      });
    }

    return NextResponse.json(
      { success: true, projectId: project.id },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
        quotes: true,
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
