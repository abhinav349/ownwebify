"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Layout, Briefcase, ShoppingCart, Cpu, Plus } from "lucide-react";
import { GeoPrice } from "@/components/shared/geo-price";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { Reveal, StaggerGroup, StaggerItem, easeCinematic } from "@/components/demos/shared/reveal";

const services = [
  {
    icon: Layout,
    name: "Landing Page",
    priceUSD: 59,
    description: "A high-converting single page that turns visitors into leads.",
    highlights: ["Responsive design", "SEO optimized", "1 week delivery"],
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Briefcase,
    name: "Business Website",
    priceUSD: 118,
    description: "A complete multi-page site that showcases your brand professionally.",
    highlights: ["Up to 8 custom pages", "CMS & blog setup", "2-3 week delivery"],
    gradient: "from-primary/10 to-pink-500/10",
  },
  {
    icon: ShoppingCart,
    name: "E-Commerce",
    priceUSD: 235,
    description: "A full online store with payments, inventory, and order management.",
    highlights: ["Cart & checkout", "Payment integration", "4-6 week delivery"],
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    icon: Cpu,
    name: "Web Application",
    priceUSD: 353,
    description: "Custom web apps with complex logic, authentication, and integrations.",
    highlights: ["Custom architecture", "Auth & API development", "6-10 week delivery"],
    gradient: "from-green-500/10 to-emerald-500/10",
  },
];

export function ServicesSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-24 relative" id="services">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            What We Build
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            One Studio.{" "}
            <span className="gradient-text">Every Digital Product.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From a single landing page to a full-scale web application — same craft,
            same care, transparent pricing.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.1}>
          {services.map((service, index) => {
            const isOpen = expanded === index;
            return (
              <StaggerItem key={service.name}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="tilt-card w-full text-left rounded-2xl border glass p-8 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <service.icon className="h-7 w-7 text-primary" />
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: easeCinematic }}
                      className="shrink-0 text-muted-foreground"
                    >
                      <Plus className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{service.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Starting at{" "}
                    <span className="font-semibold text-foreground">
                      <GeoPrice amount={service.priceUSD} />
                    </span>
                  </p>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: easeCinematic }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 border-t space-y-2.5">
                          {service.highlights.map((h) => (
                            <li key={h} className="flex items-center gap-2.5 text-sm">
                              <Check className="h-4 w-4 text-primary shrink-0" />
                              {h}
                            </li>
                          ))}
                        </div>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </button>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <div className="mt-12 text-center">
          <Magnetic strength={0.25} className="inline-block">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View full pricing & add-ons <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
