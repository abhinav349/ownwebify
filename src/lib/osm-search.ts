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
 * roughly one request/second. The `leadSearchOsm` rate limit on the route
 * that calls this (60/hour/admin) already sits well under that, so no
 * separate throttling is done here.
 *
 * The public Overpass instance is shared infrastructure and sheds load
 * aggressively: it returns 504s intermittently even for small areas that
 * succeed on a retry. Every failure mode below is therefore reported to the
 * caller rather than folded into an empty result - an empty list must mean
 * "the area genuinely has no matches", never "the lookup broke", or the UI
 * has no way to tell the user which happened.
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

// Overpass has to scan every object in the box before it can apply the
// output cap, so an area this large times out server-side no matter how
// few results we ask for - "restaurants in California" (~98 sq deg) burns
// the full 25s and comes back empty. Rejecting it up front turns a 30s
// wait ending in a blank screen into an instant, actionable message.
//
// Sized to comfortably clear any city or metro (Los Angeles ~0.35,
// Greater London ~0.3, Toronto ~0.15, Bangalore ~0.10 sq deg) while still
// catching states and countries.
const MAX_BBOX_AREA_SQ_DEG = 2;

// 504/429/502/503 from Overpass are load shedding, not a bad query; the
// same request usually succeeds moments later.
const OVERPASS_RETRY_STATUSES = new Set([429, 502, 503, 504]);
const OVERPASS_MAX_ATTEMPTS = 3;
const OVERPASS_RETRY_BACKOFF_MS = [1000, 3000];

export type OsmSearchFailure =
  | "geocode_failed"
  | "area_too_large"
  | "overpass_unavailable"
  | "overpass_timeout";

export type OsmSearchResult =
  | { ok: true; places: OsmPlace[] }
  | { ok: false; reason: OsmSearchFailure; message: string };

export interface OsmPlace {
  placeId: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  category: string | null;
  rating: null;
  userRatings: null;
  mapsUrl: string | null;
}

// OSM has no schema police: the same fact gets tagged under several keys
// depending on which editor preset the mapper used. `contact:*` is the
// namespaced convention, the bare keys are the older (still more common)
// style, and both appear on the same map. Reading only one of each pair -
// which is what this file used to do - silently discards contact details
// Overpass already handed us, so every alias is checked, best-documented
// first.
const PHONE_TAGS = ["phone", "contact:phone", "contact:mobile", "mobile"];
const EMAIL_TAGS = ["email", "contact:email"];
const WEBSITE_TAGS = ["website", "contact:website", "url"];

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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type OverpassOutcome =
  | { ok: true; elements: OverpassElement[] }
  | { ok: false; reason: "overpass_unavailable" | "overpass_timeout" };

async function runOverpassQuery(ql: string): Promise<OverpassOutcome> {
  let lastStatus: number | null = null;

  for (let attempt = 0; attempt < OVERPASS_MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await wait(
        OVERPASS_RETRY_BACKOFF_MS[attempt - 1] ??
          OVERPASS_RETRY_BACKOFF_MS[OVERPASS_RETRY_BACKOFF_MS.length - 1]
      );
    }

    let res: Response;
    try {
      res = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": OSM_USER_AGENT,
        },
        body: `data=${encodeURIComponent(ql)}`,
      });
    } catch (err) {
      // Network-level failure (DNS, connection reset). Same class of
      // transient problem as a 504, so it gets the same retry.
      console.error("Overpass request failed:", err);
      lastStatus = null;
      continue;
    }

    if (!res.ok) {
      lastStatus = res.status;
      console.error("Overpass API error:", res.status);
      if (OVERPASS_RETRY_STATUSES.has(res.status)) continue;
      return { ok: false, reason: "overpass_unavailable" };
    }

    let data: { elements?: OverpassElement[]; remark?: string };
    try {
      data = await res.json();
    } catch {
      lastStatus = res.status;
      continue;
    }

    // Overpass reports a server-side query timeout or memory exhaustion as
    // a `remark` on an otherwise-200 response with no elements. Without
    // this check that reads as "no businesses here", which is exactly the
    // wrong thing to tell the user.
    if (data.remark && !data.elements?.length) {
      console.error("Overpass remark:", data.remark);
      return { ok: false, reason: "overpass_timeout" };
    }

    return { ok: true, elements: data.elements ?? [] };
  }

  console.error("Overpass exhausted retries; last status:", lastStatus);
  return { ok: false, reason: "overpass_unavailable" };
}

/**
 * First usable value across a list of equivalent tag keys.
 *
 * OSM packs multiple values into one tag with semicolons
 * (`phone=+91 80 2345 6789;+91 98450 12345`), so the raw value can't be used
 * as-is - a `tel:` link or a WhatsApp deep link built from it would be
 * malformed. Only the first value is kept; the extras are almost always a
 * second line for the same business rather than new information.
 */
function firstTag(tags: Record<string, string>, keys: string[]): string | null {
  for (const key of keys) {
    const value = tags[key]?.split(";")[0].trim();
    if (value) return value;
  }
  return null;
}

/** Rejects the junk that ends up in OSM's email tags (bare domains, "n/a"). */
function cleanEmail(value: string | null): string | null {
  if (!value) return null;
  const email = value.replace(/^mailto:/i, "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(email) ? email : null;
}

/**
 * Mappers frequently omit the scheme (`website=example.com`), which makes the
 * value useless as an `href` - the browser resolves it relative to the current
 * page. Assume https, since that's what a bare domain means in practice today.
 */
function cleanWebsite(value: string | null): string | null {
  if (!value) return null;
  const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
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
    phone: firstTag(tags, PHONE_TAGS),
    email: cleanEmail(firstTag(tags, EMAIL_TAGS)),
    website: cleanWebsite(firstTag(tags, WEBSITE_TAGS)),
    category,
    rating: null,
    userRatings: null,
    mapsUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
  };
}

/**
 * Never throws: every failure comes back as `{ ok: false }` carrying a
 * reason the caller can turn into a message. A successful result with an
 * empty `places` array means the area really has no matches - the two must
 * stay distinguishable, since they call for opposite advice ("try a
 * different area" vs "try again in a moment").
 */
export async function searchOsmPlaces(query: string): Promise<OsmSearchResult> {
  try {
    const { what, where } = splitQuery(query);
    const location = where || query;

    const bbox = await geocode(location);
    if (!bbox) {
      return {
        ok: false,
        reason: "geocode_failed",
        message: `Couldn't find a place called "${location}". Try adding a city or country, e.g. "cafes in Vancouver, Canada".`,
      };
    }

    const area = (bbox.north - bbox.south) * (bbox.east - bbox.west);
    if (area > MAX_BBOX_AREA_SQ_DEG) {
      return {
        ok: false,
        reason: "area_too_large",
        message: `"${location}" covers too large an area for OpenStreetMap to search. Try a city or neighbourhood instead, e.g. "restaurants in San Francisco, California".`,
      };
    }

    const { selectors, label } = matchCategory(what);
    const outcome = await runOverpassQuery(buildOverpassQuery(selectors, bbox));

    if (!outcome.ok) {
      return {
        ok: false,
        reason: outcome.reason,
        message:
          outcome.reason === "overpass_timeout"
            ? "OpenStreetMap timed out on that area. Try a smaller or more specific location."
            : "OpenStreetMap's search service is busy right now. Please try again in a moment.",
      };
    }

    const seen = new Set<string>();
    const places: OsmPlace[] = [];
    for (const el of outcome.elements) {
      const place = toPlace(el, label);
      if (place && !seen.has(place.placeId)) {
        seen.add(place.placeId);
        places.push(place);
      }
    }
    return { ok: true, places };
  } catch (err) {
    console.error("OSM lead search error:", err);
    return {
      ok: false,
      reason: "overpass_unavailable",
      message: "The OpenStreetMap lookup failed unexpectedly. Please try again.",
    };
  }
}
