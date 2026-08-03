import { NextRequest, NextResponse, after } from "next/server";
import { randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectIntakeSchema, projectDetailsSchema } from "@/lib/validations";
import { sendEmail, newProjectEmailHtml, projectConfirmationEmailHtml } from "@/lib/email";
import { referralRewardUSD } from "@/lib/pricing";
import { generateReferralCode } from "@/lib/password";
import { enforceRateLimit } from "@/lib/rate-limit";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/project-status";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Unauthenticated callers can create a User row and trigger two emails
    // per request, so the anonymous path needs a per-IP budget. Signed-in
    // submissions are attributable, so they get a per-user budget instead.
    const limited = session?.user?.id
      ? await enforceRateLimit(request, "projectSubmit", `user:${session.user.id}`)
      : await enforceRateLimit(request, "projectSubmit");
    if (limited) return limited;

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

      // Notification only — nothing in the response depends on it, so it
      // runs after the response is flushed rather than holding the client
      // on a Resend round-trip.
      after(async () => {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@ownwebify.com";
        await sendEmail({
          to: adminEmail,
          subject: `New Project Request: ${project.title}`,
          html: newProjectEmailHtml(project.title, user.name, user.email),
        });
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

    // Both sends are side effects the response does not report on, and this
    // is the public lead form — two sequential Resend round-trips were
    // sitting between the prospect hitting Submit and seeing confirmation.
    const createdUser = user;
    after(async () => {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@ownwebify.com";
      await sendEmail({
        to: adminEmail,
        subject: `New Project Request: ${project.title}`,
        html: newProjectEmailHtml(
          project.title,
          createdUser.name,
          createdUser.email
        ),
      });

      // Confirmation to the client, with an account setup link if they
      // haven't set a password yet.
      let setupUrl: string | undefined;
      if (!createdUser.passwordHash) {
        const token = randomBytes(32).toString("hex");
        await prisma.setupToken.create({
          data: {
            userId: createdUser.id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        const base = process.env.NEXTAUTH_URL || "https://ownwebify.com";
        setupUrl = `${base}/setup-account?token=${token}`;
      }

      await sendEmail({
        to: createdUser.email,
        subject: `Project Received: ${project.title}`,
        html: projectConfirmationEmailHtml(
          project.title,
          createdUser.name,
          setupUrl
        ),
      });
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
    // Passing an arbitrary string through to a Prisma enum filter makes the
    // query throw, surfacing as a 500 for what is really a bad request.
    if (status) {
      if (!PROJECT_STATUSES.includes(status as ProjectStatus)) {
        return NextResponse.json(
          { error: "Invalid status filter" },
          { status: 400 }
        );
      }
      where.status = status;
    }

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
