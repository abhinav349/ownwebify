"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPrice, formatDisplayPrice } from "@/lib/pricing";
import { useCurrency } from "@/hooks/use-currency";

const services = [
  {
    name: "Landing Page",
    priceUSD: 59,
    originalPriceUSD: 118,
    priceNote: "one-time",
    description: "A high-converting single page that turns visitors into leads.",
    features: [
      "Responsive design",
      "SEO optimized",
      "Contact form integration",
      "Analytics setup",
      "1 revision round",
      "1 week delivery",
    ],
    popular: false,
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    name: "Business Website",
    priceUSD: 118,
    originalPriceUSD: 235,
    priceNote: "starting at",
    description: "A complete multi-page site that showcases your brand professionally.",
    features: [
      "Up to 8 custom pages",
      "Bespoke design",
      "CMS integration",
      "Blog setup",
      "Full SEO optimization",
      "Contact & lead forms",
      "3 revision rounds",
      "2-3 week delivery",
    ],
    popular: true,
    gradient: "from-primary/10 to-pink-500/10",
  },
  {
    name: "E-Commerce",
    priceUSD: 235,
    originalPriceUSD: 824,
    priceNote: "starting at",
    description: "A full online store with payments, inventory, and order management.",
    features: [
      "Product catalog",
      "Cart & checkout",
      "Payment integration",
      "Inventory system",
      "Order notifications",
      "Customer accounts",
      "Admin dashboard",
      "4-6 week delivery",
    ],
    popular: false,
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    name: "Web Application",
    priceUSD: 353,
    originalPriceUSD: 1176,
    priceNote: "starting at",
    description: "Custom web apps with complex logic, auth, and integrations.",
    features: [
      "Custom architecture",
      "User authentication",
      "Database design",
      "API development",
      "Third-party integrations",
      "Admin panel",
      "Automated testing",
      "6-10 week delivery",
    ],
    popular: false,
    gradient: "from-green-500/10 to-emerald-500/10",
  },
];

const addons = [
  { name: "SEO Audit & Optimization", priceUSD: 29, icon: "🔍" },
  { name: "Content Writing (per page)", priceUSD: 12, icon: "✍️" },
  { name: "Logo & Brand Identity", priceUSD: 47, icon: "🎨" },
  { name: "Monthly Maintenance", priceUSD: 24, icon: "🛡️", perMonth: true },
  { name: "Performance Optimization", priceUSD: 35, icon: "⚡" },
  { name: "Accessibility Audit (WCAG)", priceUSD: 35, icon: "♿" },
];

export default function ServicesPage() {
  const currency = useCurrency();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { setIsLoaded(true); }, [currency]);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-sm font-semibold text-green-700 mb-6">
              <Sparkles className="h-4 w-4" />
              Launch Offer — Up to 71% OFF for a limited time
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Affordable Web Development{" "}
              <span className="gradient-text">That Pays for Itself</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Agency-quality websites at a fraction of the price. Every plan includes
              responsive design, modern tech, and dedicated support — transparent pricing, no hidden fees.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
            {services.map((service) => (
              <Card
                key={service.name}
                className={`relative flex flex-col hover-lift border-border/50 ${
                  service.popular
                    ? "border-primary/50 shadow-xl shadow-primary/10 scale-[1.02] z-10"
                    : ""
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-pink-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Most Popular
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${service.gradient} mb-4`} />
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="min-h-[3rem]">
                    {service.description}
                  </CardDescription>
                  <div className="pt-3">
                    <span className="text-xs text-muted-foreground">
                      {service.priceNote}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-3xl font-bold">
                        {formatDisplayPrice(service.priceUSD, currency)}
                      </p>
                      <span className="text-sm font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                        {Math.round((1 - service.priceUSD / service.originalPriceUSD) * 100)}% OFF
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-through">
                      {formatDisplayPrice(service.originalPriceUSD, currency)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/hire" className="mt-8 block">
                    <Button
                      className={`w-full rounded-full ${
                        service.popular ? "shadow-lg shadow-primary/25" : ""
                      }`}
                      variant={service.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Extras
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Power Up Your Project
            </h2>
            <p className="mt-4 text-muted-foreground">
              Add these to any package for maximum impact.
            </p>
          </div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center justify-between p-5 rounded-xl border bg-card hover-lift"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{addon.icon}</span>
                  <span className="text-sm font-medium">{addon.name}</span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {formatDisplayPrice(addon.priceUSD, currency)}
                  {addon.perMonth ? "/mo" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Banner */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="p-8 rounded-2xl border bg-gradient-to-r from-primary/5 via-card to-pink-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold">
                Know someone who needs a website?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Refer a friend and earn{" "}
                <span className="font-bold text-primary">
                  {formatPrice(5, currency)}
                </span>{" "}
                credit. They get <span className="font-bold text-primary">10% off</span> their first project!
              </p>
            </div>
            <Link href="/login">
              <Button variant="outline" className="rounded-full whitespace-nowrap">
                Get Your Referral Code
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl border bg-gradient-to-br from-card via-card to-secondary/30">
            <h2 className="text-3xl font-bold tracking-tight">
              Not Sure What You Need?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              No worries! Tell me about your project and I&apos;ll recommend the perfect
              approach with a custom quote — completely free.
            </p>
            <Link href="/hire" className="inline-block mt-8">
              <Button size="xl" className="rounded-full shadow-lg shadow-primary/25">
                Describe Your Project <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">
              Free consultation. Response within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
