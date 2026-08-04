import { describe, it, expect } from "vitest";

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
