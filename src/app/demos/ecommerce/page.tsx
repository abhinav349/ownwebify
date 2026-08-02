import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Archivo, Inter } from "next/font/google";
import { ShoppingBag, Mail, Truck, RotateCcw } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/ecommerce/hero";
import { Offerings } from "@/components/demos/ecommerce/offerings";
import { Story } from "@/components/demos/ecommerce/story";
import { Showcase } from "@/components/demos/ecommerce/showcase";

const ACCENT = "#e8e6e1";

export const metadata: Metadata = {
  title: "Velvet & Thread | Fashion Store — Website Demo",
  description:
    "A minimalist high-fashion e-commerce demo site with clean lines, curated collections, and a scroll-driven cinematic experience.",
  alternates: { canonical: "https://ownwebify.com/demos/ecommerce" },
  openGraph: {
    title: "Velvet & Thread - Fashion Store Website Demo",
    description: "Cinematic demo website for a fashion e-commerce brand, built by OwnWebify.",
    url: "https://ownwebify.com/demos/ecommerce",
  },
};

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const collections = ["SUMMER 2026", "RESORT WEAR", "EVENING EDIT", "ESSENTIALS", "LIMITED RUN"];

export default function EcommerceDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#0a0a0a] text-[#f2f1ee] ${archivo.variable} ${inter.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#0a0a0a" } as CSSProperties}
    >
      <DemoSeo
        name="Velvet & Thread"
        type="Fashion Store"
        slug="ecommerce"
        description="A minimalist fashion e-commerce website demo with product grids, collections, and cinematic scroll storytelling in monochrome."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Velvet & Thread"
        icon={ShoppingBag}
        accent={ACCENT}
        ctaLabel="Shop Now"
        links={[
          { href: "#shop", label: "Shop" },
          { href: "#about", label: "Story" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {collections.map((collection) => (
            <span key={collection} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {collection}
              <span className="text-white/50">&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Story />
      <Showcase />

      <Testimonials
        eyebrow="As Worn By"
        title="What Our Customers Say"
        accent={ACCENT}
        items={[
          { text: "Every piece feels considered. Nothing in my wardrobe wears as well as this.", author: "Sofia M.", rating: 5 },
          { text: "The quality is unmatched for the price point — these are true investment pieces.", author: "Style Atlas", rating: 5 },
          { text: "Understated, elegant, and it actually lasts. My go-to for anything special.", author: "Nora K.", rating: 5 },
        ]}
      />

      <DemoCta
        id="newsletter"
        eyebrow="Stay in the Loop"
        title="Join the List"
        subtitle="First access to new collections, private sales, and styling notes — no spam, ever."
        accent={ACCENT}
        buttonLabel="Subscribe"
        details={[
          { icon: Truck, text: "Free worldwide shipping" },
          { icon: RotateCcw, text: "30-day returns" },
          { icon: Mail, text: "hello@velvetandthread.co" },
        ]}
      />

      <DemoFooter name="Velvet & Thread" icon={ShoppingBag} tagline="Fewer, better things" accent={ACCENT} />
    </div>
  );
}
