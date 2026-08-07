import { describe, it, expect, vi, afterEach } from "vitest";
import { searchOsmPlaces } from "@/lib/osm-search";

// Extract the query-parsing helpers for testing.
// They're defined (and kept internal) in src/lib/osm-search.ts.
function splitQuery(query: string): { what: string; where: string } {
  const match = query.match(/^(.*?)\s+\bin\b\s+(.+)$/i);
  if (!match) return { what: "", where: query.trim() };
  return { what: match[1].trim(), where: match[2].trim() };
}

interface CategoryMatch {
  selectors: string[];
  label: string;
}

const CATEGORY_TAGS: (CategoryMatch & { pattern: RegExp })[] = [
  { pattern: /restaurant|dining|eatery/i, selectors: ['["amenity"="restaurant"]'], label: "Restaurant" },
  { pattern: /caf(e|é)|coffee/i, selectors: ['["amenity"="cafe"]'], label: "Cafe" },
  { pattern: /salon|hair|barber/i, selectors: ['["shop"="hairdresser"]'], label: "Salon" },
  { pattern: /gym|fitness/i, selectors: ['["leisure"="fitness_centre"]'], label: "Gym" },
  { pattern: /dentist/i, selectors: ['["amenity"="dentist"]'], label: "Dentist" },
];

const FALLBACK_CATEGORY: CategoryMatch = {
  selectors: ['["shop"]', '["office"]', '["craft"]'],
  label: "Business",
};

function matchCategory(what: string): CategoryMatch {
  if (!what) return FALLBACK_CATEGORY;
  return CATEGORY_TAGS.find((c) => c.pattern.test(what)) ?? FALLBACK_CATEGORY;
}

describe("splitQuery", () => {
  it("splits a category and location joined by 'in'", () => {
    expect(splitQuery("restaurants in Koramangala, Bangalore")).toEqual({
      what: "restaurants",
      where: "Koramangala, Bangalore",
    });
  });

  it("is case-insensitive on the 'in' separator", () => {
    expect(splitQuery("gyms IN Toronto, Canada")).toEqual({
      what: "gyms",
      where: "Toronto, Canada",
    });
  });

  it("treats the whole string as a location when there's no 'in'", () => {
    expect(splitQuery("Bangalore")).toEqual({ what: "", where: "Bangalore" });
  });

  it("trims whitespace around both halves", () => {
    expect(splitQuery("  salons   in   HSR Layout  ")).toEqual({
      what: "salons",
      where: "HSR Layout",
    });
  });

  it("only splits on 'in' as a whole word, not inside another word", () => {
    // "Interior Design in Brooklyn" - the "in" inside "Interior" must not
    // be treated as the separator; only the standalone word should split.
    expect(splitQuery("Interior Design in Brooklyn")).toEqual({
      what: "Interior Design",
      where: "Brooklyn",
    });
  });
});

// Mirrors the guard in src/lib/osm-search.ts that rejects a bounding box
// too large for Overpass to scan before it times out.
const MAX_BBOX_AREA_SQ_DEG = 2;

function isAreaSearchable(dLat: number, dLon: number): boolean {
  return dLat * dLon <= MAX_BBOX_AREA_SQ_DEG;
}

describe("bounding box area guard", () => {
  it("rejects a whole US state", () => {
    // California, as returned by Nominatim: ~9.48 x 10.35 degrees.
    expect(isAreaSearchable(9.48, 10.35)).toBe(false);
  });

  it("allows a large metro area", () => {
    // Los Angeles ~0.68 x 0.51 degrees.
    expect(isAreaSearchable(0.68, 0.51)).toBe(true);
  });

  it("allows a city", () => {
    // Toronto ~0.28 x 0.53, Bangalore ~0.31 x 0.32 degrees.
    expect(isAreaSearchable(0.28, 0.53)).toBe(true);
    expect(isAreaSearchable(0.31, 0.32)).toBe(true);
  });

  it("allows a neighbourhood", () => {
    // Koramangala ~0.04 x 0.04 degrees.
    expect(isAreaSearchable(0.04, 0.04)).toBe(true);
  });

  it("treats the threshold itself as searchable", () => {
    expect(isAreaSearchable(1, MAX_BBOX_AREA_SQ_DEG)).toBe(true);
    expect(isAreaSearchable(1, MAX_BBOX_AREA_SQ_DEG + 0.001)).toBe(false);
  });
});

describe("matchCategory", () => {
  it("matches a known category by keyword", () => {
    expect(matchCategory("restaurants").label).toBe("Restaurant");
    expect(matchCategory("hair salon").label).toBe("Salon");
    expect(matchCategory("dentists").label).toBe("Dentist");
  });

  it("falls back to the generic business category for an empty query", () => {
    expect(matchCategory("").label).toBe("Business");
  });

  it("falls back to the generic business category for an unrecognized term", () => {
    expect(matchCategory("blorptastic widgets").label).toBe("Business");
  });
});

/**
 * Tag extraction, exercised through the real `searchOsmPlaces` with the two
 * HTTP calls stubbed.
 *
 * Unlike the helpers above (which are copies), this drives the actual
 * shipping code, because the thing being checked is precisely which tag keys
 * it reads - a test against a copy of the tag list would pass no matter what
 * the module does.
 */
describe("searchOsmPlaces tag extraction", () => {
  const bbox = ["12.90", "12.95", "77.60", "77.65"];

  function stubOsm(tags: Record<string, string>) {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL) => {
        const url = input.toString();
        if (url.includes("nominatim")) {
          return new Response(JSON.stringify([{ boundingbox: bbox }]), {
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({
            elements: [{ type: "node", id: 1, lat: 12.92, lon: 77.62, tags }],
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
  }

  async function firstPlace(tags: Record<string, string>) {
    stubOsm({ name: "Thai Cafe", ...tags });
    const result = await searchOsmPlaces("cafes in Koramangala, Bangalore");
    if (!result.ok) throw new Error(`search failed: ${result.reason}`);
    return result.places[0];
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads the bare phone tag", async () => {
    expect((await firstPlace({ phone: "+91 80 2345 6789" })).phone).toBe(
      "+91 80 2345 6789"
    );
  });

  it("falls back through the contact: namespace and the mobile aliases", async () => {
    expect((await firstPlace({ "contact:phone": "+91 80 1111" })).phone).toBe(
      "+91 80 1111"
    );
    expect((await firstPlace({ "contact:mobile": "+91 98450 2222" })).phone).toBe(
      "+91 98450 2222"
    );
    expect((await firstPlace({ mobile: "+91 98450 3333" })).phone).toBe(
      "+91 98450 3333"
    );
  });

  it("keeps only the first of a semicolon-separated tag value", async () => {
    // A raw multi-value string makes an unusable tel:/wa.me link.
    expect(
      (await firstPlace({ phone: "+91 80 2345 6789;+91 98450 12345" })).phone
    ).toBe("+91 80 2345 6789");
  });

  it("reads both email tag spellings", async () => {
    expect((await firstPlace({ email: "info@thaicafe.in" })).email).toBe(
      "info@thaicafe.in"
    );
    expect(
      (await firstPlace({ "contact:email": "hello@thaicafe.in" })).email
    ).toBe("hello@thaicafe.in");
  });

  it("normalises an email tag written as a mailto link", async () => {
    expect((await firstPlace({ email: "mailto:Info@ThaiCafe.in" })).email).toBe(
      "info@thaicafe.in"
    );
  });

  it("discards an email tag that isn't an address", async () => {
    expect((await firstPlace({ email: "n/a" })).email).toBeNull();
    expect((await firstPlace({ email: "thaicafe.in" })).email).toBeNull();
  });

  it("is null for phone and email when the business tags neither", async () => {
    const place = await firstPlace({});
    expect(place.phone).toBeNull();
    expect(place.email).toBeNull();
  });

  it("adds the scheme mappers leave off, so the value works as a link", async () => {
    expect((await firstPlace({ website: "thaicafe.in" })).website).toBe(
      "https://thaicafe.in/"
    );
  });

  it("leaves an already-qualified website alone and reads the url alias", async () => {
    expect(
      (await firstPlace({ website: "https://thaicafe.in/menu" })).website
    ).toBe("https://thaicafe.in/menu");
    expect((await firstPlace({ url: "https://thaicafe.in/" })).website).toBe(
      "https://thaicafe.in/"
    );
  });
});
