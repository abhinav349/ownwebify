"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { SITE_NAV } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full flex justify-center px-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto glass border rounded-full flex items-center justify-between transition-all duration-500 ease-out",
          scrolled
            ? "mt-3 max-w-4xl w-full px-4 py-2 shadow-lg shadow-black/5"
            : "mt-5 max-w-6xl w-full px-6 py-3"
        )}
      >
        <Link href="/" aria-label="OwnWebify home" className="flex items-center gap-2.5 group shrink-0">
          <Logo size={scrolled ? 28 : 32} className="transition-all duration-500" />
          <span className="font-bold tracking-tight text-sm sm:text-base transition-all duration-500">
            OwnWebify
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {SITE_NAV.map((item) => (
            <Magnetic key={item.name} strength={0.25}>
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all inline-block",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            </Magnetic>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full")}
          >
            Sign In
          </Link>
          <Magnetic strength={0.3}>
            <Link
              href="/hire"
              className={cn(buttonVariants({ size: "sm" }), "rounded-full shadow-md shadow-primary/20")}
            >
              Start a Project <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Magnetic>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden fixed inset-x-4 top-20 z-50 bg-background/95 backdrop-blur-xl border rounded-3xl shadow-xl">
          <div className="space-y-1 px-4 py-5">
            {SITE_NAV.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-full")}
              >
                Sign In
              </Link>
              <Link
                href="/hire"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(buttonVariants(), "w-full rounded-full")}
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
