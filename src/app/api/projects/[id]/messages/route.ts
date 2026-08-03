import { NextRequest, NextResponse, after } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authorizeProject } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendEmail, newMessageEmailHtml } from "@/lib/email";

const MAX_MESSAGE_LENGTH = 5000;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = await enforceRateLimit(
      request,
      "message",
      `user:${session.user.id}`
    );
    if (limited) return limited;

    const { id } = await params;

    // The project id is caller-supplied, so membership must be checked
    // before anything is written against it.
    const access = await authorizeProject(id);
    if (!access.ok) {
      return NextResponse.json(
        { error: access.status === 401 ? "Unauthorized" : "Project not found" },
        { status: access.status }
      );
    }

    const { content } = await request.json();

    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
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

    // Notify the other party after the response is flushed — in a chat UI
    // the send latency is felt directly, and the lookup plus the Resend
    // round-trip were both on that path.
    after(async () => {
      const project = await prisma.project.findUnique({
        where: { id },
        include: { client: true },
      });

      if (!project) return;

      const recipientEmail = access.isAdmin
        ? project.client.email
        : process.env.ADMIN_EMAIL || "admin@ownwebify.com";

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
    });

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
    const { id } = await params;

    const access = await authorizeProject(id);
    if (!access.ok) {
      return NextResponse.json(
        { error: access.status === 401 ? "Unauthorized" : "Project not found" },
        { status: access.status }
      );
    }

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
