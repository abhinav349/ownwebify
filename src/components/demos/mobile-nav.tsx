"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface MobileNavProps {
  links: { href: string; label: string }[];
  cta?: { label: string; className?: string };
  /** Classes for the hamburger button icon */
  className?: string;
  /** Classes for each link */
  linkClassName?: string;
  /** Explicit background + border for the dropdown panel */
  menuClassName?: string;
}

export function MobileNav({
  links,
  cta,
  className = "",
  linkClassName = "",
  menuClassName = "bg-white border-gray-200",
}: MobileNavProps) {
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
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className={`absolute top-full left-0 right-0 border-b shadow-xl z-50 animate-slide-up ${menuClassName}`}
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium py-2.5 border-b border-black/5 last:border-0 ${linkClassName}`}
                >
                  {link.label}
                </a>
              ))}
              {cta && (
                <button
                  className={`mt-3 w-full py-3 text-sm font-semibold rounded-lg transition-colors ${cta.className || ""}`}
                  onClick={() => setOpen(false)}
                >
                  {cta.label}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
