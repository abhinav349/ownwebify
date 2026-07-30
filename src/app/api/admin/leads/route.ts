import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { businesses, searchQuery } = body as {
    businesses: {
      placeId: string;
      name: string;
      address: string;
      phone?: string | null;
      category?: string | null;
      rating?: number | null;
      userRatings?: number | null;
    }[];
    searchQuery?: string;
  };

  if (!businesses?.length) {
    return NextResponse.json(
      { error: "No businesses provided" },
      { status: 400 }
    );
  }

  const results = await Promise.allSettled(
    businesses.map((b) =>
      prisma.lead.upsert({
        where: { placeId: b.placeId },
        update: {
          businessName: b.name,
          address: b.address,
          phone: b.phone ?? null,
          category: b.category ?? null,
          rating: b.rating ?? null,
          userRatings: b.userRatings ?? null,
        },
        create: {
          placeId: b.placeId,
          businessName: b.name,
          address: b.address,
          phone: b.phone ?? null,
          category: b.category ?? null,
          rating: b.rating ?? null,
          userRatings: b.userRatings ?? null,
          searchQuery: searchQuery ?? null,
        },
      })
    )
  );

  const saved = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ saved, failed });
}
