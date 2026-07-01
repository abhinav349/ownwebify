import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ClientSidebar } from "@/components/layout/client-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="flex h-screen">
      <ClientSidebar userName={session.user.name} />
      <main className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
