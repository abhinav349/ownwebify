import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Fraunces, Inter } from "next/font/google";
import { Building2, MapPin, Phone, Mail } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { Hero } from "@/components/demos/real-estate/hero";
import { Offerings } from "@/components/demos/real-estate/offerings";
import { Story } from "@/components/demos/real-estate/story";
import { Showcase } from "@/components/demos/real-estate/showcase";

const ACCENT = "#d4af61";

export const metadata: Metadata = {
  title: "Skyline Properties | Real Estate — Website Demo",
  description:
    "A professional real estate demo site with a trustworthy navy & gold palette, curated listings, and a scroll-driven cinematic experience.",
  openGraph: {
    title: "Skyline Properties - Real Estate Website Demo",
    description: "Cinematic demo website for a real estate agency, built by OwnWebify.",
    url: "https://ownwebify.com/demos/real-estate",
  },
};

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const neighborhoods = ["MANHATTAN", "BROOKLYN", "HUDSON VALLEY", "UPPER EAST SIDE", "CHELSEA", "WILLIAMSBURG"];

export default function RealEstateDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#0a0f14] text-[#eef1f3] ${fraunces.variable} ${inter.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#0a0f14" } as CSSProperties}
    >
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Skyline Properties"
        icon={Building2}
        accent={ACCENT}
        ctaLabel="Get in Touch"
        links={[
          { href: "#listings", label: "Listings" },
          { href: "#about", label: "About" },
          { href: "#reviews", label: "Reviews" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {neighborhoods.map((neighborhood) => (
            <span key={neighborhood} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {neighborhood}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Story />
      <Showcase />

      <Testimonials
        id="reviews"
        eyebrow="Client Stories"
        title="What Our Clients Say"
        accent={ACCENT}
        items={[
          { text: "Skyline made our dream home a reality. Their market knowledge is unmatched.", author: "James & Sarah T.", rating: 5 },
          { text: "Sold our property in just five days above asking price. Exceptional service.", author: "Dr. Michelle K.", rating: 5 },
          { text: "The most professional and dedicated real estate team we've ever worked with.", author: "Robert Chen", rating: 5 },
        ]}
      />

      <DemoCta
        id="contact"
        eyebrow="Let's Talk"
        title="Book a Consultation"
        subtitle="Whether buying, selling, or just exploring the market — our team is ready when you are."
        accent={ACCENT}
        buttonLabel="Schedule a Call"
        details={[
          { icon: Phone, text: "(555) 200-SKYLINE" },
          { icon: Mail, text: "hello@skylineproperties.co" },
          { icon: MapPin, text: "One Park Row, New York, NY" },
        ]}
      />

      <DemoFooter name="Skyline Properties" icon={Building2} tagline="Find your place in the skyline" accent={ACCENT} />
    </div>
  );
}
