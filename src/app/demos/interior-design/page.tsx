import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { Sofa, MapPin, Clock, Mail } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/interior-design/hero";
import { Offerings } from "@/components/demos/interior-design/offerings";
import { Story } from "@/components/demos/interior-design/story";
import { Showcase } from "@/components/demos/interior-design/showcase";

const ACCENT = "#c9a87c";

export const metadata: Metadata = {
  title: "Studio Loam | Interior Design — Website Demo",
  description:
    "An interior design studio demo site with project galleries, service tiers, and a scroll-driven cinematic experience. See how OwnWebify designs portfolio websites for design studios.",
  alternates: { canonical: "https://ownwebify.com/demos/interior-design" },
  openGraph: {
    title: "Studio Loam - Interior Design Website Demo",
    description: "Cinematic demo website for an interior design studio, built by OwnWebify.",
    url: "https://ownwebify.com/demos/interior-design",
  },
};

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const materials = ["WHITE OAK", "LIME PLASTER", "UNLACQUERED BRASS", "WOOL", "TRAVERTINE", "LINEN"];

export default function InteriorDesignDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#15120e] text-[#f0eae1] ${bricolage.variable} ${inter.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#15120e" } as CSSProperties}
    >
      <DemoSeo
        name="Studio Loam"
        type="Interior Design Studio"
        slug="interior-design"
        description="An interior design studio website demo with project galleries, service tiers, and cinematic scroll storytelling in a warm clay palette."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Studio Loam"
        icon={Sofa}
        accent={ACCENT}
        ctaLabel="Enquire"
        links={[
          { href: "#services", label: "Services" },
          { href: "#about", label: "Studio" },
          { href: "#contact", label: "Contact" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {materials.map((material) => (
            <span key={material} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {material}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Story />
      <Showcase />

      <Testimonials
        eyebrow="Client Notes"
        title="What Our Clients Say"
        accent={ACCENT}
        items={[
          { text: "Two years in and the house still feels finished rather than decorated. That's the difference.", author: "Sarah & Tom Fenwick", rating: 5 },
          { text: "They talked us out of three expensive ideas and the result was better for it.", author: "J. Marlowe", rating: 5 },
          { text: "The joinery detailing alone was worth the engagement. Genuinely considered work.", author: "Dwell Magazine", rating: 5 },
        ]}
      />

      <DemoCta
        id="contact"
        eyebrow="Let's Talk"
        title="Start a Project"
        subtitle="Tell us about the space and how you want to live in it. We'll tell you honestly if we're the right studio."
        accent={ACCENT}
        buttonLabel="Send an Enquiry"
        details={[
          { icon: Mail, text: "studio@studioloam.co" },
          { icon: Clock, text: "Booking Q1 2027" },
          { icon: MapPin, text: "Unit 4, The Tannery, Bermondsey" },
        ]}
      />

      <DemoFooter name="Studio Loam" icon={Sofa} tagline="Material first, trend never" accent={ACCENT} />
    </div>
  );
}
