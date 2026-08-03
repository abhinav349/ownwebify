import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fraunces, Inter } from "next/font/google";
import {
  ArrowRight,
  Coffee,
  UtensilsCrossed,
  Scissors,
  Dumbbell,
  ShoppingBag,
  Building2,
  Camera,
  Stethoscope,
  Hotel,
  Scale,
  Sofa,
  Flower2,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { MobileNav } from "@/components/demos/mobile-nav";
import { CreativeWorkJsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";
import { SITE_NAV } from "@/lib/site";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { img, demoImages } from "@/lib/demos/images";
import { LazyHeroCanvas as HeroCanvas } from "@/components/demos/three/lazy-hero-canvas";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const demos = [
  {
    slug: "cafe",
    name: "Brew & Bean",
    type: "Coffee Shop",
    icon: Coffee,
    accent: "#c8873f",
    image: demoImages.cafe.interior,
    description: "A cozy artisan coffee shop with warm earthy tones.",
  },
  {
    slug: "restaurant",
    name: "Saffron Table",
    type: "Fine Dining",
    icon: UtensilsCrossed,
    accent: "#caa25a",
    image: demoImages.restaurant.hero,
    description: "Elegant fine dining with a luxurious burgundy & gold palette.",
  },
  {
    slug: "salon",
    name: "Glow Studio",
    type: "Beauty Salon",
    icon: Scissors,
    accent: "#e3aab4",
    image: demoImages.salon.hero,
    description: "Premium beauty salon with a soft feminine aesthetic.",
  },
  {
    slug: "fitness",
    name: "IronPulse",
    type: "Gym & Fitness",
    icon: Dumbbell,
    accent: "#b6ff3c",
    image: demoImages.fitness.hero,
    description: "Bold energetic gym with neon green accents on dark.",
  },
  {
    slug: "ecommerce",
    name: "Velvet & Thread",
    type: "Fashion Store",
    icon: ShoppingBag,
    accent: "#e8e6e1",
    image: demoImages.ecommerce.editorial,
    description: "Minimalist high-fashion e-commerce with clean lines.",
  },
  {
    slug: "real-estate",
    name: "Skyline Properties",
    type: "Real Estate",
    icon: Building2,
    accent: "#d4af61",
    image: demoImages.realEstate.hero,
    description: "Professional real estate with a trustworthy navy & gold palette.",
  },
  {
    slug: "photography",
    name: "Lens & Light",
    type: "Photography Studio",
    icon: Camera,
    accent: "#d8d8d8",
    image: demoImages.photography.hero,
    description: "Artistic minimal photography portfolio in monochrome.",
  },
  {
    slug: "clinic",
    name: "CarePlus Medical",
    type: "Healthcare Clinic",
    icon: Stethoscope,
    accent: "#4fd1c5",
    image: demoImages.clinic.hero,
    description: "Calm and trustworthy clinic with soothing teal tones.",
  },
  {
    slug: "hotel",
    name: "Aurelia Bay Resort",
    type: "Boutique Hotel",
    icon: Hotel,
    accent: "#e8a87c",
    image: demoImages.hotel.hero,
    description: "Coastal boutique hotel in warm terracotta, built for direct bookings.",
  },
  {
    slug: "law-firm",
    name: "Whitmore & Cole",
    type: "Law Firm",
    icon: Scale,
    accent: "#9fb3c8",
    image: demoImages.lawFirm.hero,
    description: "Authoritative legal practice site in a cool slate palette.",
  },
  {
    slug: "interior-design",
    name: "Studio Loam",
    type: "Interior Design",
    icon: Sofa,
    accent: "#c9a87c",
    image: demoImages.interiorDesign.hero,
    description: "Material-led design studio portfolio in warm clay tones.",
  },
  {
    slug: "spa",
    name: "Willow & Stone",
    type: "Spa & Wellness",
    icon: Flower2,
    accent: "#9fb89a",
    image: demoImages.spa.hero,
    description: "Calm wellness retreat with a sage palette and treatment menu.",
  },
];

export default function DemosIndexPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#0a0a0d] text-[#f2f1ee] ${fraunces.variable} ${inter.variable}`}
      style={{ "--accent": "#c9a3f5", "--bg": "#0a0a0d" } as CSSProperties}
    >
      <div className="demo-grain" />
      {demos.map((demo) => (
        <CreativeWorkJsonLd
          key={demo.slug}
          name={`${demo.name} - ${demo.type} Website`}
          description={demo.description}
          url={`https://ownwebify.com/demos/${demo.slug}`}
        />
      ))}

      {/* Header */}
      <header className="relative z-20 py-8 px-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size={32} />
            {/* Hidden below `sm`: the wordmark, the CTA pill and the hamburger
                together overflow a 390px viewport otherwise. Same trade the
                main site header makes. */}
            <span className="font-semibold text-lg tracking-tight hidden sm:inline">
              OwnWebify
            </span>
          </Link>

          {/* This page had no navigation at all — only a logo and a CTA — so
              the gallery was a dead end for anyone wanting Services or About,
              with the floating "Built by" badge the sole route back. */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
            {SITE_NAV.map((item) => {
              const current = item.href === "/demos";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "text-sm tracking-wide transition-colors",
                    current ? "text-white" : "text-white/60 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            <Magnetic>
              <Link
                href="/hire"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0a0a0d] text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors shadow-lg whitespace-nowrap"
              >
                Start Your Project <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <MobileNav
              links={SITE_NAV.map((item) => ({ href: item.href, label: item.name }))}
              className="text-white/80"
              linkClassName="text-white/80 border-white/10"
              menuClassName="bg-[#0a0a0d] border-white/10"
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-70">
          <HeroCanvas variant="particles" color="#c9a3f5" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0a0a0d]/40 to-[#0a0a0d]" />
        <div className="mx-auto max-w-4xl text-center relative">
          <Reveal>
            <p className="eyebrow-demo">Live Demos</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 font-display text-4xl md:text-7xl leading-[1.05] text-balance">
              Websites that speak{" "}
              <em className="italic text-[#c9a3f5]">your industry</em>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Every business is unique. Explore these live demos to see how we craft
              tailored, cinematic designs for different industries — each with its own
              personality.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Demo Grid */}
      <section className="px-6 pb-28">
        <StaggerGroup
          className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          stagger={0.08}
        >
          {demos.map((demo) => {
            const cover = img(demo.image, 640, 70);
            return (
              <StaggerItem key={demo.slug}>
                <Magnetic strength={0.12} className="block h-full">
                  <Link
                    href={`/demos/${demo.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-white/[0.02]"
                    data-cursor="link"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className="absolute inset-0 opacity-40 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-25"
                        style={{ backgroundColor: demo.accent }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/10 to-transparent" />
                      <demo.icon
                        className="absolute bottom-3 left-4 h-6 w-6 transition-transform duration-500 group-hover:-translate-y-1"
                        style={{ color: demo.accent }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white/40">
                        {demo.type}
                      </p>
                      <h3 className="mt-1.5 font-display text-xl">{demo.name}</h3>
                      <p className="mt-2 text-sm text-white/50 leading-relaxed flex-1">
                        {demo.description}
                      </p>
                      <div
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                        style={{ color: demo.accent }}
                      >
                        View Demo{" "}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </Link>
                </Magnetic>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>
    </div>
  );
}
