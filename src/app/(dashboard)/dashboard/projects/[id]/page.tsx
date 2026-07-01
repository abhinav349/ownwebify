import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteResponse } from "@/components/forms/quote-response";
import { MessageThread } from "@/components/shared/message-thread";

const statusSteps = ["NEW", "REVIEWING", "QUOTED", "IN_PROGRESS", "COMPLETED"];

export default async function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      quotes: { orderBy: { createdAt: "desc" } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { name: true, role: true } } },
      },
    },
  });

  if (!project || project.clientId !== session.user.id) {
    notFound();
  }

  const currentStepIndex = statusSteps.indexOf(project.status);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
        {project.status.replace("_", " ")}
      </span>

      {/* Status Timeline */}
      {project.status !== "CANCELLED" && (
        <div className="mt-8 mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      index <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                    {step.replace("_", " ")}
                  </span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 ${
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
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
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="mt-1 capitalize">{project.projectType.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget</p>
                  <p className="mt-1">{project.budget}</p>
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
                  senderName: m.sender.name,
                  senderRole: m.sender.role,
                  createdAt: m.createdAt.toISOString(),
                }))}
                projectId={project.id}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quotes */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              {project.quotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No quotes yet. You&apos;ll receive a quote once the project is reviewed.
                </p>
              ) : (
                <div className="space-y-4">
                  {project.quotes.map((quote) => (
                    <div key={quote.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(quote.amount)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {quote.description}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Valid until {formatDate(quote.validUntil)}
                      </p>
                      {quote.status === "PENDING" && (
                        <QuoteResponse
                          projectId={project.id}
                          quoteId={quote.id}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
