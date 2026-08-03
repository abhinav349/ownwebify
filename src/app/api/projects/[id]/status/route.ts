import { NextRequest, NextResponse, after } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, statusChangeEmailHtml } from "@/lib/email";
import { isProjectStatus } from "@/lib/project-status";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!isProjectStatus(status)) {
      return NextResponse.json(
        { error: "Invalid project status" },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: { status },
      include: { client: true },
    });

    // Notify client of status change — side effect only, so keep it off the
    // admin's response path.
    if (project.client.email) {
      const clientEmail = project.client.email;
      after(async () => {
        await sendEmail({
          to: clientEmail,
          subject: `Project Update: ${project.title}`,
          html: statusChangeEmailHtml(project.title, status),
        });
      });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
