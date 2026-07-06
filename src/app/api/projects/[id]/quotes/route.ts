import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, quoteEmailHtml } from "@/lib/email";

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
    const { amount, description, validUntil } = await request.json();

    const quote = await prisma.quote.create({
      data: {
        projectId: id,
        amount,
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

    // Notify client
    if (project.client.email) {
      await sendEmail({
        to: project.client.email,
        subject: `New Quote for: ${project.title}`,
        html: quoteEmailHtml(project.title, amount, description),
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
