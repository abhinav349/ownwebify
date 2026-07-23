import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectIntakeSchema, projectDetailsSchema } from "@/lib/validations";
import { sendEmail, newProjectEmailHtml } from "@/lib/email";
import { referralRewardUSD } from "@/lib/pricing";

function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, "X");
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    // Logged-in users: create the project directly against their account
    // without requiring contact info, a password, or OTP verification.
    if (session?.user?.id) {
      const data = projectDetailsSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const project = await prisma.project.create({
        data: {
          title: data.title,
          description: data.description,
          projectType: data.projectType,
          budget: data.budget,
          timeline: data.timeline,
          referenceLinks: data.referenceLinks || null,
          howFoundUs: data.howFoundUs || null,
          features: data.features || [],
          clientId: user.id,
        },
      });

      const adminEmail = process.env.ADMIN_EMAIL || "admin@ownwebify.com";
      await sendEmail({
        to: adminEmail,
        subject: `New Project Request: ${project.title}`,
        html: newProjectEmailHtml(project.title, user.name, user.email),
      });

      return NextResponse.json(
        { success: true, projectId: project.id },
        { status: 201 }
      );
    }

    const validatedData = projectIntakeSchema.parse(body);

    let user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    const isNewUser = !user;

    if (!user) {
      const referralCode = generateReferralCode(validatedData.name);
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          company: validatedData.company || null,
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
        features: validatedData.features || [],
        clientId: user.id,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || "admin@ownwebify.com";
    await sendEmail({
      to: adminEmail,
      subject: `New Project Request: ${project.title}`,
      html: newProjectEmailHtml(project.title, user.name, user.email),
    });

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    // Non-admin users can only see their own projects
    if (session.user.role !== "ADMIN") {
      where.clientId = session.user.id;
    }

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
