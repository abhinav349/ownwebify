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
      website?: string | null;
      mapsUrl?: string | null;
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
          website: b.website ?? null,
          mapsUrl: b.mapsUrl ?? null,
          rating: b.rating ?? null,
          userRatings: b.userRatings ?? null,
        },
        create: {
          placeId: b.placeId,
          businessName: b.name,
          address: b.address,
          phone: b.phone ?? null,
          category: b.category ?? null,
          website: b.website ?? null,
          mapsUrl: b.mapsUrl ?? null,
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

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status, notes } = body as {
    id: string;
    status?: string;
    notes?: string;
  };

  if (!id) {
    return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (status !== undefined) data.status = status;
  if (notes !== undefined) data.notes = notes;

  const lead = await prisma.lead.update({
    where: { id },
    data,
  });

  return NextResponse.json({ lead });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await req.json()) as { id: string };

  if (!id) {
    return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
  }

  await prisma.lead.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
