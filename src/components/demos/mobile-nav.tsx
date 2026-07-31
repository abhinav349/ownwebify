"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { easeCinematic } from "@/components/demos/shared/reveal";

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
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              className={`absolute top-full left-0 right-0 border-b shadow-xl z-50 ${menuClassName}`}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: easeCinematic }}
            >
              <div className="px-6 py-5 flex flex-col gap-1">
                {links.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium py-2.5 border-b border-black/5 last:border-0 ${linkClassName}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i, ease: easeCinematic }}
                  >
                    {link.label}
                  </motion.a>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
