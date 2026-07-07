import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, getStatusColor } from "@/lib/utils";
import { formatBudget, formatFromUSD } from "@/lib/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusUpdateForm } from "@/components/forms/status-update-form";
import { QuoteForm } from "@/components/forms/quote-form";
import { MessageThread } from "@/components/shared/message-thread";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      quotes: { orderBy: { createdAt: "desc" } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { name: true, role: true } } },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold break-words">{project.title}</h1>
        <span className={`text-sm px-3 py-1 rounded-full font-medium self-start whitespace-nowrap ${getStatusColor(project.status)}`}>
          {project.status.replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="mt-1">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Type</p>
                  <p className="mt-1 capitalize">{project.projectType.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget</p>
                  <p className="mt-1">{formatBudget(project.budget, "INR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                  <p className="mt-1 capitalize">{project.timeline.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="mt-1">{formatDate(project.createdAt)}</p>
                </div>
              </div>
              {project.referenceLinks && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reference Links</p>
                  <p className="mt-1 text-primary">{project.referenceLinks}</p>
                </div>
              )}
              {project.howFoundUs && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">How They Found Us</p>
                  <p className="mt-1 capitalize">{project.howFoundUs.replace("-", " ")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <MessageThread
                messages={project.messages.map((m) => ({
                  id: m.id,
                  content: m.content,
                  imageUrl: m.imageUrl,
                  senderName: m.sender.name,
                  senderRole: m.sender.role,
                  createdAt: m.createdAt.toISOString(),
                }))}
                projectId={project.id}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{project.client.name}</p>
              <p className="text-sm text-muted-foreground">{project.client.email}</p>
              {project.client.company && (
                <p className="text-sm text-muted-foreground">{project.client.company}</p>
              )}
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusUpdateForm projectId={project.id} currentStatus={project.status} />
            </CardContent>
          </Card>

          {/* Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              {project.quotes.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {project.quotes.map((quote) => (
                    <div key={quote.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{formatFromUSD(quote.amount, "INR")}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{quote.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Valid until {formatDate(quote.validUntil)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">No quotes sent yet.</p>
              )}
              <QuoteForm projectId={project.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
