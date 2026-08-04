"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  FolderKanban,
  Users,
  Image,
  LogOut,
  Settings,
  Menu,
  X,
  Home,
  Crosshair,
  BookmarkCheck,
  MapPinned,
  MessageSquareQuote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

// `exact` opts an entry out of the prefix match below. Needed for any href
// that is a prefix of another entry's href, otherwise both light up at
// once - /admin/leads has /admin/leads/saved and /admin/leads/osm nested
// under it, each with their own entry.
const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3, exact: true },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Lead Finder", href: "/admin/leads", icon: Crosshair, exact: true },
  { name: "OSM Leads", href: "/admin/leads/osm", icon: MapPinned },
  { name: "Saved Leads", href: "/admin/leads/saved", icon: BookmarkCheck },
  { name: "Portfolio", href: "/admin/portfolio", icon: Image },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Logo size={32} />
          <span className="font-semibold">OwnWebify Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (!item.exact && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-1">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5" />
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b bg-card">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-semibold text-sm">Admin</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Mobile sidebar drawer */}
      <aside className={cn(
        "md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-card border-r flex flex-col transition-transform duration-200",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-card flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
