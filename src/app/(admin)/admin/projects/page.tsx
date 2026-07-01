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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
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
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{project.client.name}</span>
                        <span>&middot;</span>
                        <span>{project.projectType}</span>
                        <span>&middot;</span>
                        <span>{project.budget}</span>
                        <span>&middot;</span>
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground ml-4">
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
