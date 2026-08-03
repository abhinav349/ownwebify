import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role || null,
        quote: body.quote,
        avatarUrl: body.avatarUrl || null,
        rating: body.rating ?? null,
        published: body.published || false,
        featured: body.featured || false,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Testimonial update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
