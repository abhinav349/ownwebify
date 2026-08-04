import { prisma } from "@/lib/prisma";
import { OsmLeadFinder } from "./osm-lead-finder";

export default async function AdminOsmLeadsPage() {
  const savedLeads = await prisma.lead.findMany({
    select: { placeId: true },
  });

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">OpenStreetMap Leads</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          A free, keyless alternative to the Google-powered Lead Finder —
          same idea, sourced from OpenStreetMap instead.
        </p>
      </div>
      <OsmLeadFinder savedPlaceIds={savedLeads.map((l) => l.placeId)} />
    </div>
  );
}
