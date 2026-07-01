import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, newMessageEmailHtml } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        projectId: id,
        senderId: session.user.id,
        content: content.trim(),
      },
      include: {
        sender: { select: { name: true, role: true } },
      },
    });

    // Send email notification to the other party
    const project = await prisma.project.findUnique({
      where: { id },
      include: { client: true },
    });

    if (project) {
      const isAdmin = session.user.role === "ADMIN";
      const recipientEmail = isAdmin
        ? project.client.email
        : process.env.ADMIN_EMAIL;

      if (recipientEmail) {
        await sendEmail({
          to: recipientEmail,
          subject: `New message on: ${project.title}`,
          html: newMessageEmailHtml(
            project.title,
            session.user.name,
            content.slice(0, 200)
          ),
        });
      }
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const messages = await prisma.message.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { name: true, role: true } },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
