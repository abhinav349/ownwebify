import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PLACES_API_URL =
  "https://places.googleapis.com/v1/places:searchText";

// Google's Text Search (New) caps pageSize at 20 per call and requires the
// original textQuery to be resent on every pageToken continuation request -
// omitting it (as this route used to) makes Google reject the "load more"
// call outright. There's also a documented short delay needed before a
// freshly-issued pageToken becomes valid.
const GOOGLE_PAGE_SIZE = 20;
const BATCH_TARGET = 50;
const PAGE_TOKEN_DELAY_MS = 2000;
const MAX_CHAINED_CALLS = 5;

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

const FIELD_MASK = [
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(
  apiKey: string,
  textQuery: string,
  pageToken: string | undefined
): Promise<{ places: PlaceResult[]; nextPageToken?: string }> {
  const requestBody: Record<string, unknown> = {
    textQuery,
    pageSize: GOOGLE_PAGE_SIZE,
  };
  if (pageToken) {
    requestBody.pageToken = pageToken;
  }

  const res = await fetch(PLACES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Places API error:", errText);
    throw new Error(`places_api_${res.status}`);
  }

  const data = (await res.json()) as {
    places?: PlaceResult[];
    nextPageToken?: string;
  };

  return { places: data.places ?? [], nextPageToken: data.nextPageToken };
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

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    const collected: PlaceResult[] = [];
    let token = pageToken;
    let nextPageToken: string | undefined;

    // Chain Google's 20-per-call pages together into one ~50-result batch.
    // Google caps every query at 60 total results, so a later batch may
    // come back shorter than 50 with nextPageToken null - that's expected,
    // not an error.
    for (let i = 0; i < MAX_CHAINED_CALLS && collected.length < BATCH_TARGET; i++) {
      if (token) {
        await delay(PAGE_TOKEN_DELAY_MS);
      }

      const page = await fetchPage(apiKey, query, token);
      collected.push(...page.places);
      nextPageToken = page.nextPageToken;
      token = nextPageToken;

      if (!nextPageToken) break;
    }

    const places = collected.map((p) => ({
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
      nextPageToken: nextPageToken ?? null,
      total: places.length,
      withoutWebsite: places.filter((p) => !p.website).length,
    });
  } catch (err) {
    console.error("Places search error:", err);
    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 502 }
    );
  }
}
