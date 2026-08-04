/**
 * Free, keyless supplement to the Google Places lead search.
 *
 * Google's Places API is billed per call (see the search route), which caps
 * how much of the world we can afford to search. OpenStreetMap's public
 * Nominatim (geocoding) and Overpass (POI query) services cost nothing and
 * need no API key, at the price of being crowd-sourced: coverage and tag
 * completeness (especially `website`/`phone`) vary a lot by region.
 *
 * Unlike Places, Overpass has no free-text search - it matches structured
 * tags inside a bounding box. So a query like "salons in HSR Layout,
 * Bangalore" has to be split into a location ("HSR Layout, Bangalore"),
 * geocoded to a box via Nominatim, and a business type ("salons"), mapped to
 * OSM tags via CATEGORY_TAGS below.
 *
 * Both services publish fair-use policies capping automated callers at
 * roughly one request/second. The `leadSearch` rate limit on the route that
 * calls this (60/hour/admin) already sits well under that, so no separate
 * throttling is done here.
 */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Both services ask automated callers to identify themselves with a
// descriptive User-Agent (and, ideally, a contact) rather than a generic
// browser string - Nominatim's usage policy blocks requests that don't.
const OSM_USER_AGENT =
  "OwnWebify-LeadFinder/1.0 (+https://ownwebify.com; admin@ownwebify.com)";

const OVERPASS_TIMEOUT_S = 25;
const MAX_OSM_RESULTS = 60;

// A geocoded bounding box smaller than this (e.g. Nominatim matching one
// exact address rather than a neighborhood) is padded out to roughly a
// 1km square so Overpass has an area worth searching instead of one point.
const MIN_BBOX_SPAN_DEG = 0.01;

export interface OsmPlace {
  placeId: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  category: string | null;
  rating: null;
  userRatings: null;
  mapsUrl: string | null;
}

interface Bbox {
  south: number;
  north: number;
  west: number;
  east: number;
}

interface CategoryMatch {
  /** Overpass tag selectors, e.g. `["amenity"="cafe"]`, OR'd together. */
  selectors: string[];
  label: string;
}

// Mirrors the business categories the app's own demo templates target
// (cafe, clinic, hotel, interior-design, law-firm, photography, real-estate,
// restaurant, salon, spa, ...) plus the terms used in the Lead Finder's own
// query suggestions, so the common searches resolve to a precise tag filter
// instead of falling back to the generic "any shop/office" query below.
const CATEGORY_TAGS: (CategoryMatch & { pattern: RegExp })[] = [
  { pattern: /restaurant|dining|eatery/i, selectors: ['["amenity"="restaurant"]'], label: "Restaurant" },
  { pattern: /caf(e|é)|coffee/i, selectors: ['["amenity"="cafe"]'], label: "Cafe" },
  { pattern: /bakery/i, selectors: ['["shop"="bakery"]'], label: "Bakery" },
  { pattern: /salon|hair|barber/i, selectors: ['["shop"="hairdresser"]'], label: "Salon" },
  { pattern: /\bspa\b/i, selectors: ['["leisure"="spa"]', '["shop"="beauty"]'], label: "Spa" },
  { pattern: /gym|fitness/i, selectors: ['["leisure"="fitness_centre"]'], label: "Gym" },
  { pattern: /dentist/i, selectors: ['["amenity"="dentist"]'], label: "Dentist" },
  { pattern: /clinic|doctor|physician|medical/i, selectors: ['["amenity"="clinic"]', '["healthcare"="clinic"]'], label: "Clinic" },
  { pattern: /hotel|inn\b|lodging/i, selectors: ['["tourism"="hotel"]'], label: "Hotel" },
  { pattern: /law firm|lawyer|attorney|legal/i, selectors: ['["office"="lawyer"]'], label: "Law Firm" },
  { pattern: /real estate|realtor|property/i, selectors: ['["office"="estate_agent"]'], label: "Real Estate" },
  { pattern: /photograph/i, selectors: ['["shop"="photo"]', '["craft"="photographer"]'], label: "Photography" },
  { pattern: /boutique|clothing|clothes|apparel/i, selectors: ['["shop"="boutique"]', '["shop"="clothes"]'], label: "Boutique" },
  { pattern: /interior design/i, selectors: ['["shop"="interior_decoration"]'], label: "Interior Design" },
];

// Used when the "what" half of the query doesn't match a known category
// (or there wasn't one, e.g. the query was just a place name). Still scoped
// to the geocoded bounding box, so it broadens the *type* of result rather
// than the area.
const FALLBACK_CATEGORY: CategoryMatch = {
  selectors: ['["shop"]', '["office"]', '["craft"]'],
  label: "Business",
};

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** Splits "salons in HSR Layout, Bangalore" into what="salons" / where="HSR Layout, Bangalore". */
function splitQuery(query: string): { what: string; where: string } {
  const match = query.match(/^(.*?)\s+\bin\b\s+(.+)$/i);
  if (!match) return { what: "", where: query.trim() };
  return { what: match[1].trim(), where: match[2].trim() };
}

function matchCategory(what: string): CategoryMatch {
  if (!what) return FALLBACK_CATEGORY;
  return CATEGORY_TAGS.find((c) => c.pattern.test(what)) ?? FALLBACK_CATEGORY;
}

async function geocode(place: string): Promise<Bbox | null> {
  const url = `${NOMINATIM_URL}?format=jsonv2&limit=1&q=${encodeURIComponent(place)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": OSM_USER_AGENT, "Accept-Language": "en" },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { boundingbox?: [string, string, string, string] }[];
  const box = data[0]?.boundingbox;
  if (!box) return null;

  // Nominatim orders boundingbox as [min_lat, max_lat, min_lon, max_lon].
  let south = parseFloat(box[0]);
  let north = parseFloat(box[1]);
  let west = parseFloat(box[2]);
  let east = parseFloat(box[3]);
  if ([south, north, west, east].some(Number.isNaN)) return null;

  if (north - south < MIN_BBOX_SPAN_DEG) {
    const mid = (north + south) / 2;
    south = mid - MIN_BBOX_SPAN_DEG / 2;
    north = mid + MIN_BBOX_SPAN_DEG / 2;
  }
  if (east - west < MIN_BBOX_SPAN_DEG) {
    const mid = (east + west) / 2;
    west = mid - MIN_BBOX_SPAN_DEG / 2;
    east = mid + MIN_BBOX_SPAN_DEG / 2;
  }

  return { south, north, west, east };
}

function buildOverpassQuery(selectors: string[], bbox: Bbox): string {
  const box = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;
  const clauses = selectors
    .map((sel) => `  node${sel}(${box});\n  way${sel}(${box});`)
    .join("\n");
  // "center" adds a lat/lon for ways (which are otherwise just a list of
  // member node ids); the default body output already includes tags.
  return `[out:json][timeout:${OVERPASS_TIMEOUT_S}];\n(\n${clauses}\n);\nout body center ${MAX_OSM_RESULTS};`;
}

async function runOverpassQuery(ql: string): Promise<OverpassElement[]> {
  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": OSM_USER_AGENT,
    },
    body: `data=${encodeURIComponent(ql)}`,
  });

  if (!res.ok) {
    console.error("Overpass API error:", res.status, await res.text());
    return [];
  }

  const data = (await res.json()) as { elements?: OverpassElement[] };
  return data.elements ?? [];
}

function toPlace(el: OverpassElement, category: string): OsmPlace | null {
  const tags = el.tags ?? {};
  const name = tags.name;
  if (!name) return null;

  const lat = el.type === "node" ? el.lat : el.center?.lat;
  const lon = el.type === "node" ? el.lon : el.center?.lon;
  if (lat == null || lon == null) return null;

  const addressParts = [
    [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" "),
    tags["addr:city"],
    tags["addr:postcode"],
  ].filter((part): part is string => !!part);

  return {
    // Prefixed so it can never collide with a Google Place ID (which never
    // contains a slash after "node"/"way"/"relation"), letting OSM leads
    // share the same unique `placeId` column as Google ones with no schema
    // change - and doubling as a source tag if that column is ever read.
    placeId: `osm:${el.type}/${el.id}`,
    name,
    address: addressParts.join(", "),
    phone: tags.phone ?? tags["contact:phone"] ?? null,
    website: tags.website ?? tags["contact:website"] ?? null,
    category,
    rating: null,
    userRatings: null,
    mapsUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
  };
}

/**
 * Best-effort: any failure (bad geocode, Overpass timeout/outage) resolves
 * to an empty list rather than throwing, since this is a supplementary
 * source layered on top of Google Places, never the only one a search
 * depends on.
 */
export async function searchOsmPlaces(query: string): Promise<OsmPlace[]> {
  try {
    const { what, where } = splitQuery(query);
    const bbox = await geocode(where || query);
    if (!bbox) return [];

    const { selectors, label } = matchCategory(what);
    const elements = await runOverpassQuery(buildOverpassQuery(selectors, bbox));

    const seen = new Set<string>();
    const places: OsmPlace[] = [];
    for (const el of elements) {
      const place = toPlace(el, label);
      if (place && !seen.has(place.placeId)) {
        seen.add(place.placeId);
        places.push(place);
      }
    }
    return places;
  } catch (err) {
    console.error("OSM lead search error:", err);
    return [];
  }
}
