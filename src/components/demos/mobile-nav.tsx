"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface MobileNavProps {
  links: { href: string; label: string }[];
  cta?: { label: string; className?: string };
  className?: string;
  linkClassName?: string;
}

export function MobileNav({ links, cta, className = "", linkClassName = "" }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-lg transition-colors ${className}`}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 border-b shadow-lg animate-slide-up z-50 bg-inherit">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium py-2 ${linkClassName}`}
              >
                {link.label}
              </a>
            ))}
            {cta && (
              <button
                className={`mt-2 w-full py-3 text-sm font-semibold rounded-lg transition-colors ${cta.className || ""}`}
                onClick={() => setOpen(false)}
              >
                {cta.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
