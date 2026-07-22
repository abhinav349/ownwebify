import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function AdminClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      _count: { select: { projects: true } },
      projects: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { title: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-sm text-muted-foreground">
          {clients.length} total clients
        </p>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No clients yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{client.name}</h3>
                      {client.emailVerified ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                    {client.company && (
                      <p className="text-sm text-muted-foreground">{client.company}</p>
                    )}
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {client._count.projects} projects
                  </span>
                </div>
                {client.projects[0] && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">Latest project:</p>
                    <p className="text-sm font-medium mt-1">{client.projects[0].title}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  Joined {formatDate(client.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
