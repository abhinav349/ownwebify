import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { searchOsmPlaces } from "@/lib/osm-search";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await enforceRateLimit(
    req,
    "leadSearchOsm",
    `user:${session.user.id}`
  );
  if (limited) return limited;

  const body = await req.json();
  const { query } = body as { query?: string };

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  // Unlike the Google route, there's no billed-call chain and no
  // pageToken to walk - Overpass returns everything it found (capped at
  // MAX_OSM_RESULTS in osm-search.ts) in a single request.
  const result = await searchOsmPlaces(query);

  if (!result.ok) {
    // A too-large area or an unrecognised place is a problem with the
    // query, so it's a 400; anything else is OSM being unavailable, which
    // is upstream's fault and worth retrying, so 502.
    const status =
      result.reason === "area_too_large" || result.reason === "geocode_failed"
        ? 400
        : 502;
    return NextResponse.json(
      { error: result.message, reason: result.reason },
      { status }
    );
  }

  const { places } = result;

  return NextResponse.json({
    places,
    total: places.length,
    withoutWebsite: places.filter((p) => !p.website).length,
  });
}
