import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PLACES_API_URL =
  "https://places.googleapis.com/v1/places:searchText";

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  primaryTypeDisplayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Places API key not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { query, pageToken } = body as {
    query?: string;
    pageToken?: string;
  };

  if (!query && !pageToken) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    const requestBody: Record<string, unknown> = {
      pageSize: 20,
    };

    if (pageToken) {
      requestBody.pageToken = pageToken;
    }
    if (query) {
      requestBody.textQuery = query;
    }

    const fieldMask = [
      "places.id",
      "places.displayName",
      "places.formattedAddress",
      "places.internationalPhoneNumber",
      "places.websiteUri",
      "places.primaryTypeDisplayName",
      "places.rating",
      "places.userRatingCount",
      "places.googleMapsUri",
      "nextPageToken",
    ].join(",");

    const res = await fetch(PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Places API error:", errText);
      return NextResponse.json(
        { error: "Failed to search places" },
        { status: res.status }
      );
    }

    const data = (await res.json()) as {
      places?: PlaceResult[];
      nextPageToken?: string;
    };

    const places = (data.places ?? []).map((p) => ({
      placeId: p.id,
      name: p.displayName?.text ?? "Unknown",
      address: p.formattedAddress ?? "",
      phone: p.internationalPhoneNumber ?? null,
      website: p.websiteUri ?? null,
      category: p.primaryTypeDisplayName?.text ?? null,
      rating: p.rating ?? null,
      userRatings: p.userRatingCount ?? null,
      mapsUrl: p.googleMapsUri ?? null,
    }));

    return NextResponse.json({
      places,
      nextPageToken: data.nextPageToken ?? null,
      total: places.length,
      withoutWebsite: places.filter((p) => !p.website).length,
    });
  } catch (err) {
    console.error("Places search error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
