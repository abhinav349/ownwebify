import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Users, DollarSign, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [totalProjects, activeProjects, totalClients, quotes] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "IN_PROGRESS" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.quote.findMany({ where: { status: "ACCEPTED" } }),
    ]);

  const totalRevenue = quotes.reduce((sum, q) => sum + q.amount, 0);

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, email: true } },
    },
  });

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: FolderKanban },
    { label: "Active Projects", value: activeProjects, icon: Clock },
    { label: "Total Clients", value: totalClients, icon: Users },
    { label: "Revenue", value: formatCurrency(totalRevenue), icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects yet.</p>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-lg border"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{project.title}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {project.client.name} &middot; {project.client.email}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap self-start sm:self-auto ${
                      project.status === "NEW"
                        ? "bg-blue-100 text-blue-800"
                        : project.status === "IN_PROGRESS"
                        ? "bg-orange-100 text-orange-800"
                        : project.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
