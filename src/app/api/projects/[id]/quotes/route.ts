import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, quoteEmailHtml } from "@/lib/email";
import {
  formatAmount,
  toCurrencyCode,
  applyDiscount,
  referralDiscountPercent,
} from "@/lib/pricing";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { amount, description, validUntil, currency } = await request.json();
    const quoteCurrency = toCurrencyCode(currency);

    // Determine referral discount: a referred client gets 10% off the quote
    // for their first project only.
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { clientId: true, client: { select: { referredById: true } } },
    });

    let discountPercent = 0;
    if (existing?.client.referredById) {
      const firstProject = await prisma.project.findFirst({
        where: { clientId: existing.clientId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      if (firstProject?.id === id) {
        discountPercent = referralDiscountPercent;
      }
    }

    const quote = await prisma.quote.create({
      data: {
        projectId: id,
        amount,
        currency: quoteCurrency,
        discountPercent,
        description,
        validUntil: new Date(validUntil),
      },
    });

    // Update project status to QUOTED
    const project = await prisma.project.update({
      where: { id },
      data: { status: "QUOTED" },
      include: { client: true },
    });

    // Notify client (show the discounted total they will pay)
    if (project.client.email) {
      const payable = applyDiscount(amount, discountPercent);
      const amountLabel =
        discountPercent > 0
          ? `${formatAmount(payable, quoteCurrency, quoteCurrency)} (incl. ${discountPercent}% referral discount)`
          : formatAmount(amount, quoteCurrency, quoteCurrency);

      let setupUrl: string | undefined;
      if (!project.client.passwordHash) {
        const token = randomBytes(32).toString("hex");
        await prisma.setupToken.create({
          data: {
            userId: project.client.id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        });
        const base = process.env.NEXTAUTH_URL || "https://ownwebify.com";
        setupUrl = `${base}/setup-account?token=${token}`;
      }

      await sendEmail({
        to: project.client.email,
        subject: `New Quote for: ${project.title}`,
        html: quoteEmailHtml(project.title, amountLabel, description, setupUrl),
      });
    }

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Quote creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { quoteId, status } = await request.json();

    // Verify the user owns this project or is admin
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (session.user.role !== "ADMIN" && project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: { status },
    });

    if (status === "ACCEPTED") {
      await prisma.project.update({
        where: { id },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Quote update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
