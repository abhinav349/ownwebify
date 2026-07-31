import type { LucideIcon } from "lucide-react";

export function DemoFooter({
  name,
  icon: Icon,
  tagline,
  accent,
}: {
  name: string;
  icon: LucideIcon;
  tagline: string;
  accent: string;
}) {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Icon className="h-6 w-6 mx-auto mb-3" style={{ color: accent }} />
        <p className="font-display text-lg">{name}</p>
        <p className="mt-1 text-xs text-white/40 tracking-wider">{tagline}</p>
        <p className="mt-6 text-xs text-white/30 tracking-wider">
          &copy; 2026 {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
