import { prisma } from "@/lib/prisma";
import { LeadFinder } from "./lead-finder";

export default async function AdminLeadsPage() {
  const savedLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Lead Finder</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Search for businesses without websites in any area — your next
          potential clients.
        </p>
      </div>
      <LeadFinder savedLeads={savedLeads} />
    </div>
  );
}
