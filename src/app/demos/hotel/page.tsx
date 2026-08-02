import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Bodoni_Moda, Sora } from "next/font/google";
import { Hotel, MapPin, Clock, Phone } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/hotel/hero";
import { Offerings } from "@/components/demos/hotel/offerings";
import { Story } from "@/components/demos/hotel/story";
import { Showcase } from "@/components/demos/hotel/showcase";

const ACCENT = "#e8a87c";

export const metadata: Metadata = {
  title: "Aurelia Bay Resort | Boutique Hotel — Website Demo",
  description:
    "A boutique coastal hotel demo site with warm terracotta tones, room booking, and a scroll-driven cinematic experience. See how OwnWebify designs hotel websites that win direct bookings.",
  alternates: { canonical: "https://ownwebify.com/demos/hotel" },
  openGraph: {
    title: "Aurelia Bay Resort - Boutique Hotel Website Demo",
    description: "Cinematic demo website for a boutique coastal hotel, built by OwnWebify.",
    url: "https://ownwebify.com/demos/hotel",
  },
};

const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const amenities = ["PRIVATE BAY", "COASTAL KITCHEN", "CLIFFSIDE SPA", "OLIVE GROVE", "BOAT HIRE", "SEA-VIEW TERRACE"];

export default function HotelDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#14100d] text-[#f5ede4] ${bodoni.variable} ${sora.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#14100d" } as CSSProperties}
    >
      <DemoSeo
        name="Aurelia Bay Resort"
        type="Boutique Hotel"
        slug="hotel"
        description="A boutique coastal hotel website demo with room booking, cinematic scroll storytelling, and a warm terracotta palette."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Aurelia Bay"
        icon={Hotel}
        accent={ACCENT}
        ctaLabel="Book a Stay"
        links={[
          { href: "#rooms", label: "Rooms" },
          { href: "#about", label: "Our Story" },
          { href: "#book", label: "Contact" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {amenities.map((amenity) => (
            <span key={amenity} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {amenity}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Story />
      <Showcase />

      <Testimonials
        eyebrow="Guest Book"
        title="What Our Guests Say"
        accent={ACCENT}
        items={[
          { text: "We came for three nights and rebooked for a week before we'd finished breakfast.", author: "Helena & Marc R.", rating: 5 },
          { text: "The most restful place I've stayed in a decade. The staff anticipate everything.", author: "Condé Nast Traveller", rating: 5 },
          { text: "Genuinely family-run, and you feel it in every detail. Nothing corporate about it.", author: "田中 K.", rating: 5 },
        ]}
      />

      <DemoCta
        id="book"
        eyebrow="Direct Booking"
        title="Reserve Your Stay"
        subtitle="Book direct for our best available rate - no platform commission, no booking fees."
        accent={ACCENT}
        buttonLabel="Check Availability"
        details={[
          { icon: Clock, text: "Check-in 3pm · Check-out 11am" },
          { icon: Phone, text: "+1 (555) 240-BAY" },
          { icon: MapPin, text: "12 Aurelia Cliff Road, Costa Serena" },
        ]}
      />

      <DemoFooter name="Aurelia Bay Resort" icon={Hotel} tagline="Where the coast slows down" accent={ACCENT} />
    </div>
  );
}
