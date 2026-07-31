import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { MobileNav } from "@/components/demos/mobile-nav";

export function DemoNav({
  name,
  icon: Icon,
  links,
  ctaLabel,
  accent,
}: {
  name: string;
  icon: LucideIcon;
  links: { href: string; label: string }[];
  ctaLabel: string;
  accent: string;
}) {
  return (
    <nav className="fixed top-0 w-full z-40 bg-[var(--bg)]/85 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <Link href="#top" className="flex items-center gap-3">
          <Icon className="h-6 w-6" style={{ color: accent }} />
          <span className="font-display text-xl tracking-wide">{name}</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <Magnetic strength={0.25}>
            <button
              className="px-6 py-2.5 border text-sm tracking-wider uppercase transition-colors rounded-sm"
              style={{ borderColor: `${accent}80`, color: accent }}
            >
              {ctaLabel}
            </button>
          </Magnetic>
        </div>
        <MobileNav
          links={links}
          cta={{ label: ctaLabel, className: "bg-[var(--accent)] text-black" }}
          className="text-white/80"
          linkClassName="text-white/80 border-white/10"
          menuClassName="bg-[var(--bg)] border-white/10"
        />
      </div>
    </nav>
  );
}
