import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const item = await prisma.portfolioItem.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        longDescription: body.longDescription || null,
        imageUrl: body.imageUrl || null,
        techStack: body.techStack || [],
        liveUrl: body.liveUrl || null,
        category: body.category,
        featured: body.featured || false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Portfolio creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
