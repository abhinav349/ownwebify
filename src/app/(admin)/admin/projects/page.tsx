import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, getStatusColor } from "@/lib/utils";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, email: true, company: true } },
      quotes: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
        <p className="text-sm text-muted-foreground">
          {projects.length} total projects
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No projects yet. They&apos;ll appear here when clients submit requests.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/admin/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{project.title}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(project.status)}`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                        <span>{project.client.name}</span>
                        <span className="hidden sm:inline">&middot;</span>
                        <span>{project.projectType}</span>
                        <span className="hidden sm:inline">&middot;</span>
                        <span>{project.budget}</span>
                        <span className="hidden sm:inline">&middot;</span>
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right text-sm text-muted-foreground sm:ml-4 pt-2 sm:pt-0 border-t sm:border-t-0">
                      <p>{project._count.messages} messages</p>
                      {project.quotes[0] && (
                        <p className="font-medium text-foreground">
                          ${project.quotes[0].amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
