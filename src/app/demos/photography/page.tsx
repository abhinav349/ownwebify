import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Instrument_Serif, Inter } from "next/font/google";
import { Camera, Mail, AtSign } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/photography/hero";
import { Gallery } from "@/components/demos/photography/gallery";
import { Offerings } from "@/components/demos/photography/offerings";
import { Story } from "@/components/demos/photography/story";

const ACCENT = "#d8d8d8";

export const metadata: Metadata = {
  title: "Lens & Light | Photography Studio — Website Demo",
  description:
    "An artistic minimal photography portfolio demo site in monochrome, with editorial galleries and a scroll-driven cinematic experience.",
  alternates: { canonical: "https://ownwebify.com/demos/photography" },
  openGraph: {
    title: "Lens & Light - Photography Studio Website Demo",
    description: "Cinematic demo website for a photography studio, built by OwnWebify.",
    url: "https://ownwebify.com/demos/photography",
  },
};

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const categories = ["PORTRAIT", "ARCHITECTURE", "LANDSCAPE", "EDITORIAL", "STILL LIFE", "COMMERCIAL"];

export default function PhotographyDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#0d0d0d] text-[#efefef] ${instrumentSerif.variable} ${inter.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#0d0d0d" } as CSSProperties}
    >
      <DemoSeo
        name="Lens & Light"
        type="Photography Studio"
        slug="photography"
        description="A photography studio portfolio website demo with galleries, service tiers, and cinematic scroll storytelling in monochrome."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Lens & Light"
        icon={Camera}
        accent={ACCENT}
        ctaLabel="Inquire"
        links={[
          { href: "#portfolio", label: "Portfolio" },
          { href: "#services", label: "Services" },
          { href: "#about", label: "About" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {categories.map((category) => (
            <span key={category} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {category}
              <span className="text-white/50">&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Gallery />
      <Offerings />
      <Story />

      <Testimonials
        eyebrow="Client Notes"
        title="What Clients Say"
        accent={ACCENT}
        items={[
          { text: "She has an eye for the moment before the moment. Every frame felt inevitable.", author: "Anya Petrova", rating: 5 },
          { text: "Our campaign shoot was the smoothest, most creatively led session we've had.", author: "Studio Ferro", rating: 5 },
          { text: "Fine art prints that genuinely belong on a gallery wall. Extraordinary work.", author: "The Print Review", rating: 5 },
        ]}
      />

      <DemoCta
        id="contact"
        eyebrow="Let's Create"
        title="Start a Project"
        subtitle="Available for editorial, commercial, and wedding work worldwide."
        accent={ACCENT}
        buttonLabel="Send an Inquiry"
        details={[
          { icon: Mail, text: "hello@lensandlight.studio" },
          { icon: AtSign, text: "@lensandlightstudio" },
        ]}
      />

      <DemoFooter name="Lens & Light" icon={Camera} tagline="Stories, held in a single frame" accent={ACCENT} />
    </div>
  );
}
