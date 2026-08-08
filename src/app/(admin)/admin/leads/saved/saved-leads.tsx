"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Phone,
  Star,
  Save,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  StickyNote,
  ArrowLeft,
  Filter,
  Globe,
  ExternalLink,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLeadTemplate, buildWhatsAppLink } from "@/lib/lead-templates";

interface SavedLead {
  id: string;
  placeId: string;
  businessName: string;
  address: string;
  phone: string | null;
  email: string | null;
  category: string | null;
  website: string | null;
  mapsUrl: string | null;
  rating: number | null;
  userRatings: number | null;
  // Set only by the contact-lookup enricher. null means "never checked" -
  // most rows, and every lead with no website at all - distinct from a
  // check that came back and found the site genuinely reachable.
  websiteUnreachable: boolean | null;
  status: string;
  notes: string | null;
  searchQuery: string | null;
  emailSentAt: string | null;
  createdAt: string;
}

const LEAD_STATUSES = [
  { value: "NEW", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "CONTACTED", label: "Contacted", color: "bg-yellow-100 text-yellow-800" },
  { value: "INTERESTED", label: "Interested", color: "bg-green-100 text-green-800" },
  { value: "NOT_INTERESTED", label: "Not Interested", color: "bg-gray-100 text-gray-800" },
  { value: "CONVERTED", label: "Converted", color: "bg-purple-100 text-purple-800" },
];

type StatusFilter = "ALL" | string;

/** Mirrors MAX_LEADS_PER_REQUEST in the enrich route. */
const ENRICH_BATCH_SIZE = 20;

export function SavedLeads({ initialLeads }: { initialLeads: SavedLead[] }) {
  const [leads, setLeads] = useState<SavedLead[]>(initialLeads);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [updatingLead, setUpdatingLead] = useState<Set<string>>(new Set());
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [editingEmail, setEditingEmail] = useState<Record<string, string>>({});
  const [sendingEmail, setSendingEmail] = useState<Set<string>>(new Set());
  const [emailError, setEmailError] = useState<Record<string, string>>({});
  const [enriching, setEnriching] = useState<Set<string>>(new Set());
  const [enrichNote, setEnrichNote] = useState<Record<string, string>>({});
  const [bulkEnrichNote, setBulkEnrichNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const updateLead = useCallback(
    async (id: string, data: { status?: string; notes?: string; email?: string }) => {
      setUpdatingLead((prev) => new Set(prev).add(id));
      try {
        const res = await fetch("/api/admin/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) {
          setLeads((prev) =>
            prev.map((l) => (l.id === id ? { ...l, ...data } : l))
          );
          if (data.notes !== undefined) {
            setEditingNotes((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          }
          if (data.email !== undefined) {
            setEditingEmail((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          }
        }
      } finally {
        setUpdatingLead((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    []
  );

  const sendLeadEmail = useCallback(async (lead: SavedLead) => {
    setSendingEmail((prev) => new Set(prev).add(lead.id));
    setEmailError((prev) => {
      const next = { ...prev };
      delete next[lead.id];
      return next;
    });
    try {
      const res = await fetch("/api/admin/leads/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, ...data.lead } : l))
        );
      } else {
        setEmailError((prev) => ({
          ...prev,
          [lead.id]: data.error || "Failed to send email",
        }));
      }
    } catch {
      setEmailError((prev) => ({ ...prev, [lead.id]: "Failed to send email" }));
    } finally {
      setSendingEmail((prev) => {
        const next = new Set(prev);
        next.delete(lead.id);
        return next;
      });
    }
  }, []);

  /**
   * Reads the leads' own websites looking for contact details.
   *
   * Neither lead source can provide an email address, so without this every
   * outreach email needs one typed in by hand. The server only ever fills
   * blanks, so running this over a lead that already has an address is safe.
   */
  const enrichLeads = useCallback(async (targets: SavedLead[]) => {
    if (!targets.length) return;
    const ids = targets.map((l) => l.id);

    setEnriching((prev) => new Set([...prev, ...ids]));
    setBulkEnrichNote(null);
    setEnrichNote((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });

    try {
      const res = await fetch("/api/admin/leads/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();

      if (!res.ok) {
        const message = data.error || "Contact lookup failed";
        if (ids.length === 1) setEnrichNote({ [ids[0]]: message });
        else setBulkEnrichNote(message);
        return;
      }

      const results = data.results as {
        id: string;
        email: string | null;
        phone: string | null;
        websiteUnreachable: boolean | null;
        error?: string;
      }[];

      setLeads((prev) =>
        prev.map((l) => {
          const found = results.find((r) => r.id === l.id);
          return found
            ? {
                ...l,
                email: found.email,
                phone: found.phone,
                websiteUnreachable: found.websiteUnreachable,
              }
            : l;
        })
      );

      // Per-lead reasons ("no website on file", "site published nothing")
      // are worth showing: they tell the admin which leads still need
      // manual work and why, instead of the row just not changing.
      setEnrichNote((prev) => ({
        ...prev,
        ...Object.fromEntries(
          results.filter((r) => r.error).map((r) => [r.id, r.error as string])
        ),
      }));

      if (ids.length > 1) {
        const gained = results.filter(
          (r) => r.email && !targets.find((t) => t.id === r.id)?.email
        ).length;
        setBulkEnrichNote(
          `Checked ${results.length} websites - found ${gained} new email ${
            gained === 1 ? "address" : "addresses"
          }.`
        );
      }
    } catch {
      const message = "Contact lookup failed";
      if (ids.length === 1) setEnrichNote({ [ids[0]]: message });
      else setBulkEnrichNote(message);
    } finally {
      setEnriching((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  }, []);

  const deleteLead = useCallback(async (lead: SavedLead) => {
    if (!confirm(`Remove "${lead.businessName}" from saved leads?`)) return;
    setUpdatingLead((prev) => new Set(prev).add(lead.id));
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id }),
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      }
    } finally {
      setUpdatingLead((prev) => {
        const next = new Set(prev);
        next.delete(lead.id);
        return next;
      });
    }
  }, []);

  const filtered = leads.filter((l) => {
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        l.businessName.toLowerCase().includes(term) ||
        l.address.toLowerCase().includes(term) ||
        (l.category?.toLowerCase().includes(term) ?? false) ||
        (l.phone?.includes(term) ?? false)
      );
    }
    return true;
  });

  // The leads a website lookup could actually help: something to read, and
  // no address yet.
  const enrichable = leads.filter((l) => l.website && !l.email);

  const statusCounts = LEAD_STATUSES.map((s) => ({
    ...s,
    count: leads.filter((l) => l.status === s.value).length,
  }));

  return (
    <div className="space-y-6">
      {/* Back link + stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/admin/leads">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Search
          </Button>
        </Link>

        <div className="flex flex-wrap gap-2">
          {statusCounts.map((s) => (
            <button
              key={s.value}
              onClick={() =>
                setStatusFilter(statusFilter === s.value ? "ALL" : s.value)
              }
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                statusFilter === s.value
                  ? s.color + " ring-2 ring-ring ring-offset-1"
                  : s.color + " opacity-70 hover:opacity-100"
              }`}
            >
              {s.label} ({s.count})
            </button>
          ))}
          {statusFilter !== "ALL" && (
            <button
              onClick={() => setStatusFilter("ALL")}
              className="text-xs px-2.5 py-1 rounded-full border font-medium hover:bg-muted transition-colors"
            >
              Show All ({leads.length})
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search saved leads by name, address, category, phone..."
          className="pl-10"
        />
      </div>

      {/* Bulk contact lookup */}
      {enrichable.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-muted/40">
          <p className="text-sm text-muted-foreground">
            {enrichable.length}{" "}
            {enrichable.length === 1 ? "lead has" : "leads have"} a website but
            no email address.
          </p>
          <Button
            size="sm"
            variant="outline"
            disabled={enriching.size > 0}
            onClick={() => enrichLeads(enrichable.slice(0, ENRICH_BATCH_SIZE))}
          >
            {enriching.size > 0 ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            )}
            Find emails ({Math.min(enrichable.length, ENRICH_BATCH_SIZE)})
          </Button>
        </div>
      )}

      {bulkEnrichNote && (
        <p className="text-sm text-muted-foreground">{bulkEnrichNote}</p>
      )}

      {/* Results count */}
      {(searchTerm || statusFilter !== "ALL") && (
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          Showing {filtered.length} of {leads.length} leads
        </p>
      )}

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {leads.length === 0
              ? "No saved leads yet. Use the Lead Finder to search and save businesses."
              : "No leads match your filters."}
          </p>
          {leads.length === 0 && (
            <Link href="/admin/leads" className="mt-4 inline-block">
              <Button>Go to Lead Finder</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const isExpanded = expandedLead === lead.id;
            const isUpdating = updatingLead.has(lead.id);
            const statusInfo =
              LEAD_STATUSES.find((s) => s.value === lead.status) ??
              LEAD_STATUSES[0];

            return (
              <Card key={lead.id}>
                <button
                  onClick={() =>
                    setExpandedLead(isExpanded ? null : lead.id)
                  }
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/50 transition-colors rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{lead.businessName}</span>
                      {lead.category && (
                        <Badge variant="secondary" className="text-[11px]">
                          {lead.category}
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={`text-[11px] ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </Badge>
                      {lead.website ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-[11px]">
                          <Globe className="h-3 w-3 mr-1" />
                          Has Website
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-[11px]">
                          No Website
                        </Badge>
                      )}
                      {/* A dead site is a stronger prospect than no site at
                          all - they already paid for one - so this gets its
                          own badge rather than folding into "Has Website". */}
                      {lead.website && lead.websiteUnreachable && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 text-[11px]">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Website Down
                        </Badge>
                      )}
                      {lead.notes && (
                        <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {lead.emailSentAt && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-[11px]">
                          <Mail className="h-3 w-3 mr-1" />
                          Emailed
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{lead.address}</span>
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {lead.phone}
                        </span>
                      )}
                      {lead.rating != null && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 shrink-0 text-yellow-500 fill-yellow-500" />
                          {lead.rating}
                          {lead.userRatings != null && (
                            <span className="text-xs">
                              ({lead.userRatings})
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  )}
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 pb-5 space-y-5 border-t mx-4 sm:mx-5 pt-5">
                    {/* Links & contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
                        >
                          <Phone className="h-4 w-4" />
                          {lead.phone}
                        </a>
                      )}
                      {lead.phone && (
                        <a
                          href={buildWhatsAppLink(
                            lead.phone,
                            getLeadTemplate(lead.businessName, lead.category)
                              .whatsappMessage,
                            lead.address
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-green-600 hover:underline font-medium"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Message on WhatsApp
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {lead.website && (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium truncate"
                        >
                          <Globe className="h-4 w-4 shrink-0" />
                          <span className="truncate">{lead.website}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      )}
                      {lead.mapsUrl && (
                        <a
                          href={lead.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
                        >
                          <MapPin className="h-4 w-4" />
                          View on Google Maps
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    {lead.searchQuery && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Search className="h-3.5 w-3.5" />
                        Found via: &ldquo;{lead.searchQuery}&rdquo;
                      </div>
                    )}

                    {/* Status */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {LEAD_STATUSES.map((s) => (
                          <button
                            key={s.value}
                            disabled={isUpdating}
                            onClick={() => {
                              if (lead.status !== s.value) {
                                updateLead(lead.id, { status: s.value });
                              }
                            }}
                            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                              lead.status === s.value
                                ? s.color + " ring-2 ring-ring ring-offset-1"
                                : "hover:bg-muted"
                            } ${isUpdating ? "opacity-50" : ""}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email outreach */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="email"
                          value={editingEmail[lead.id] ?? lead.email ?? ""}
                          onChange={(e) =>
                            setEditingEmail((prev) => ({
                              ...prev,
                              [lead.id]: e.target.value,
                            }))
                          }
                          placeholder="Add an email address to enable outreach"
                          className="sm:max-w-xs"
                        />
                        {editingEmail[lead.id] !== undefined &&
                          editingEmail[lead.id] !== (lead.email ?? "") && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() =>
                                updateLead(lead.id, {
                                  email: editingEmail[lead.id],
                                })
                              }
                            >
                              {isUpdating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              ) : (
                                <Save className="h-3.5 w-3.5 mr-1" />
                              )}
                              Save Email
                            </Button>
                          )}
                        {lead.website && !lead.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={enriching.has(lead.id)}
                            onClick={() => enrichLeads([lead])}
                          >
                            {enriching.has(lead.id) ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                              <Sparkles className="h-3.5 w-3.5 mr-1" />
                            )}
                            Find Email
                          </Button>
                        )}
                        <Button
                          size="sm"
                          disabled={!lead.email || sendingEmail.has(lead.id)}
                          onClick={() => sendLeadEmail(lead)}
                        >
                          {sendingEmail.has(lead.id) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            <Send className="h-3.5 w-3.5 mr-1" />
                          )}
                          Send Outreach Email
                        </Button>
                      </div>
                      {enrichNote[lead.id] && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {enrichNote[lead.id]}
                        </p>
                      )}
                      {lead.emailSentAt && (
                        <p className="text-xs text-green-700 flex items-center gap-1 mt-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Sent {new Date(lead.emailSentAt).toLocaleString()}
                        </p>
                      )}
                      {emailError[lead.id] && (
                        <p className="text-xs text-destructive mt-1.5">
                          {emailError[lead.id]}
                        </p>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                        <StickyNote className="h-3 w-3" />
                        Notes
                      </label>
                      <textarea
                        rows={3}
                        value={editingNotes[lead.id] ?? lead.notes ?? ""}
                        onChange={(e) =>
                          setEditingNotes((prev) => ({
                            ...prev,
                            [lead.id]: e.target.value,
                          }))
                        }
                        placeholder="Add notes about this lead... (e.g. website is broken, called them, interested in redesign)"
                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      {editingNotes[lead.id] !== undefined &&
                        editingNotes[lead.id] !== (lead.notes ?? "") && (
                          <Button
                            size="sm"
                            className="mt-2"
                            disabled={isUpdating}
                            onClick={() =>
                              updateLead(lead.id, {
                                notes: editingNotes[lead.id],
                              })
                            }
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                              <Save className="h-3.5 w-3.5 mr-1" />
                            )}
                            Save Notes
                          </Button>
                        )}
                    </div>

                    {/* Delete */}
                    <div className="flex justify-end pt-3 border-t">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isUpdating}
                        onClick={() => deleteLead(lead)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove Lead
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
