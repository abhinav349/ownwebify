import { prisma } from "@/lib/prisma";
import { SavedLeads } from "./saved-leads";

export default async function SavedLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Saved Leads</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Manage your saved leads — update status, add notes, and track
          outreach.
        </p>
      </div>
      <SavedLeads initialLeads={JSON.parse(JSON.stringify(leads))} />
    </div>
  );
}
