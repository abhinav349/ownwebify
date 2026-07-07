import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Plus, Gift, Copy, DollarSign, Users } from "lucide-react";
import { ReferralSection } from "./referral-section";
import { formatPrice, referralRewardUSD } from "@/lib/pricing";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      referralCode: true,
      referralBalance: true,
      _count: { select: { referralsMade: true } },
    },
  });

  const projects = await prisma.project.findMany({
    where: { clientId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      quotes: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: true } },
    },
  });

  return (
    <div>
      {/* Referral Section */}
      {user?.referralCode && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Your Referral Code</p>
                    <ReferralSection code={user.referralCode} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Referral Balance</p>
                    <p className="font-bold text-lg">${user.referralBalance.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">People Referred</p>
                    <p className="font-bold text-lg">{user._count.referralsMade}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="p-4 rounded-xl border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Share & Earn:</span>{" "}
              Share your referral code with friends. They get <span className="font-semibold text-primary">10% off</span> their first project, and you earn{" "}
              <span className="font-semibold text-primary">{formatPrice(referralRewardUSD, "INR")} credit</span> for each successful referral!
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">My Projects</h1>
        <Link href="/hire">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t submitted any projects yet.
            </p>
            <Link href="/hire">
              <Button>Start Your First Project</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
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
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span>Submitted {formatDate(project.createdAt)}</span>
                        {project._count.messages > 0 && (
                          <>
                            <span>&middot;</span>
                            <span>{project._count.messages} messages</span>
                          </>
                        )}
                      </div>
                    </div>
                    {project.quotes[0] && (
                      <div className="text-left sm:text-right sm:ml-4 pt-2 sm:pt-0 border-t sm:border-t-0">
                        <p className="text-sm text-muted-foreground">Quote</p>
                        <p className="font-semibold">
                          ${project.quotes[0].amount.toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.quotes[0].status)}`}>
                          {project.quotes[0].status}
                        </span>
                      </div>
                    )}
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
