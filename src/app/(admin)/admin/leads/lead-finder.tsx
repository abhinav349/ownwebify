"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Globe,
  GlobeOff,
  MapPin,
  Phone,
  Star,
  Save,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Place {
  placeId: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  category: string | null;
  rating: number | null;
  userRatings: number | null;
  mapsUrl: string | null;
}

interface SavedLead {
  id: string;
  placeId: string;
  businessName: string;
  status: string;
}

type FilterMode = "all" | "no-website" | "has-website";

const QUERY_SUGGESTIONS = [
  "restaurants in Koramangala, Bangalore",
  "salons in HSR Layout, Bangalore",
  "gyms in Indiranagar, Bangalore",
  "dentists in Whitefield, Bangalore",
  "cafes in JP Nagar, Bangalore",
  "boutiques in Jayanagar, Bangalore",
];

export function LeadFinder({ savedLeads }: { savedLeads: SavedLead[] }) {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [savedSet, setSavedSet] = useState<Set<string>>(
    () => new Set(savedLeads.map((l) => l.placeId))
  );
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("no-website");
  const [lastQuery, setLastQuery] = useState("");

  const search = useCallback(
    async (pageToken?: string) => {
      const isLoadMore = !!pageToken;
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setPlaces([]);
        setNextPageToken(null);
      }
      setError(null);

      try {
        const res = await fetch("/api/admin/leads/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: isLoadMore ? undefined : query,
            pageToken: pageToken ?? undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Search failed");
        }

        const data = await res.json();
        if (isLoadMore) {
          setPlaces((prev) => [...prev, ...data.places]);
        } else {
          setPlaces(data.places);
          setLastQuery(query);
        }
        setNextPageToken(data.nextPageToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query]
  );

  const saveLead = useCallback(
    async (place: Place) => {
      setSaving((prev) => new Set(prev).add(place.placeId));
      try {
        const res = await fetch("/api/admin/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businesses: [
              {
                placeId: place.placeId,
                name: place.name,
                address: place.address,
                phone: place.phone,
                category: place.category,
                rating: place.rating,
                userRatings: place.userRatings,
              },
            ],
            searchQuery: lastQuery,
          }),
        });

        if (res.ok) {
          setSavedSet((prev) => new Set(prev).add(place.placeId));
        }
      } finally {
        setSaving((prev) => {
          const next = new Set(prev);
          next.delete(place.placeId);
          return next;
        });
      }
    },
    [lastQuery]
  );

  const saveAllWithoutWebsite = useCallback(async () => {
    const toSave = places.filter(
      (p) => !p.website && !savedSet.has(p.placeId)
    );
    if (!toSave.length) return;

    const ids = new Set(toSave.map((p) => p.placeId));
    setSaving((prev) => new Set([...prev, ...ids]));

    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businesses: toSave.map((p) => ({
            placeId: p.placeId,
            name: p.name,
            address: p.address,
            phone: p.phone,
            category: p.category,
            rating: p.rating,
            userRatings: p.userRatings,
          })),
          searchQuery: lastQuery,
        }),
      });

      if (res.ok) {
        setSavedSet((prev) => new Set([...prev, ...ids]));
      }
    } finally {
      setSaving((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  }, [places, savedSet, lastQuery]);

  const filtered = places.filter((p) => {
    if (filterMode === "no-website") return !p.website;
    if (filterMode === "has-website") return !!p.website;
    return true;
  });

  const noWebsiteCount = places.filter((p) => !p.website).length;
  const hasWebsiteCount = places.filter((p) => !!p.website).length;
  const unsavedNoWebsite = places.filter(
    (p) => !p.website && !savedSet.has(p.placeId)
  ).length;

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) search();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. restaurants in Koramangala, Bangalore"
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </form>

          {/* Suggestions */}
          {!places.length && !loading && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">
                Try searching:
              </p>
              <div className="flex flex-wrap gap-2">
                {QUERY_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuery(s);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {places.length > 0 && (
        <>
          {/* Stats and filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <GlobeOff className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">
                  {noWebsiteCount} without website
                </span>
              </div>
              <span className="text-muted-foreground text-sm">|</span>
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">
                  {hasWebsiteCount} with website
                </span>
              </div>
              <span className="text-muted-foreground text-sm">|</span>
              <span className="text-sm text-muted-foreground">
                {places.length} total
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border overflow-hidden text-sm">
                <button
                  onClick={() => setFilterMode("no-website")}
                  className={`px-3 py-1.5 transition-colors ${
                    filterMode === "no-website"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Filter className="h-3 w-3" />
                    No Website
                  </span>
                </button>
                <button
                  onClick={() => setFilterMode("all")}
                  className={`px-3 py-1.5 border-l transition-colors ${
                    filterMode === "all"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterMode("has-website")}
                  className={`px-3 py-1.5 border-l transition-colors ${
                    filterMode === "has-website"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Has Website
                </button>
              </div>

              {unsavedNoWebsite > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={saveAllWithoutWebsite}
                  disabled={saving.size > 0}
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save All ({unsavedNoWebsite})
                </Button>
              )}
            </div>
          </div>

          {/* Results list */}
          <div className="space-y-3">
            {filtered.map((place) => {
              const isSaved = savedSet.has(place.placeId);
              const isSaving = saving.has(place.placeId);

              return (
                <Card
                  key={place.placeId}
                  className={
                    !place.website
                      ? "border-orange-200 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-950/10"
                      : ""
                  }
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start gap-2 flex-wrap">
                          <h3 className="font-semibold text-base">
                            {place.name}
                          </h3>
                          {place.category && (
                            <Badge variant="secondary" className="text-[11px]">
                              {place.category}
                            </Badge>
                          )}
                          {!place.website && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-[11px]">
                              No Website
                            </Badge>
                          )}
                          {isSaved && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-[11px]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Saved
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                          {place.address && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{place.address}</span>
                            </span>
                          )}
                          {place.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              {place.phone}
                            </span>
                          )}
                          {place.rating != null && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 shrink-0 text-yellow-500 fill-yellow-500" />
                              {place.rating}
                              {place.userRatings != null && (
                                <span className="text-xs">
                                  ({place.userRatings})
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        {place.website && (
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Globe className="h-3 w-3" />
                            {place.website}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {place.mapsUrl && (
                          <a
                            href={place.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              Maps
                            </Button>
                          </a>
                        )}
                        {!place.website && !isSaved && (
                          <Button
                            size="sm"
                            onClick={() => saveLead(place)}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                              <Save className="h-3.5 w-3.5 mr-1" />
                            )}
                            Save Lead
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No results match the current filter.
            </p>
          )}

          {/* Load more */}
          {nextPageToken && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => search(nextPageToken)}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Load More Results
              </Button>
            </div>
          )}
        </>
      )}

      {/* Saved leads summary */}
      {savedLeads.length > 0 && !places.length && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Saved Leads ({savedLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedLeads.slice(0, 10).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <span className="font-medium text-sm">
                    {lead.businessName}
                  </span>
                  <Badge
                    variant="secondary"
                    className={
                      lead.status === "NEW"
                        ? "bg-blue-100 text-blue-800"
                        : lead.status === "CONTACTED"
                        ? "bg-yellow-100 text-yellow-800"
                        : lead.status === "INTERESTED"
                        ? "bg-green-100 text-green-800"
                        : lead.status === "CONVERTED"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {lead.status}
                  </Badge>
                </div>
              ))}
              {savedLeads.length > 10 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  and {savedLeads.length - 10} more...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
