import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { UtensilsCrossed, MapPin, Clock, Phone } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { Hero } from "@/components/demos/restaurant/hero";
import { Offerings } from "@/components/demos/restaurant/offerings";
import { Story } from "@/components/demos/restaurant/story";
import { Showcase } from "@/components/demos/restaurant/showcase";

const ACCENT = "#caa25a";

export const metadata: Metadata = {
  title: "Saffron Table | Fine Dining — Website Demo",
  description:
    "An elegant fine dining demo site with a luxurious burgundy & gold palette, tasting menu, and a scroll-driven cinematic experience.",
  openGraph: {
    title: "Saffron Table - Fine Dining Website Demo",
    description: "Cinematic demo website for a fine dining restaurant, built by OwnWebify.",
    url: "https://ownwebify.com/demos/restaurant",
  },
};

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const notes = ["TASTING MENU", "WINE PAIRING", "OPEN KITCHEN", "SEASONAL", "CHEF'S TABLE", "PRIVATE DINING"];

export default function RestaurantDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#1a0a0a] text-[#f4ece2] ${cormorant.variable} ${manrope.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#1a0a0a" } as CSSProperties}
    >
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Saffron Table"
        icon={UtensilsCrossed}
        accent={ACCENT}
        ctaLabel="Reserve"
        links={[
          { href: "#menu", label: "Menu" },
          { href: "#about", label: "About" },
          { href: "#reviews", label: "Reviews" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {notes.map((note) => (
            <span key={note} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {note}
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
        eyebrow="Press & Reviews"
        title="What They Say"
        accent={ACCENT}
        items={[
          { text: "An unforgettable dining experience. Every course was a masterpiece.", author: "The Times", rating: 5 },
          { text: "Saffron Table sets the gold standard for fine dining in the city.", author: "Food & Wine", rating: 5 },
          { text: "Impeccable service, extraordinary flavors. A must-visit destination.", author: "Michelin Guide", rating: 5 },
        ]}
      />

      <DemoCta
        id="reserve"
        eyebrow="Reservations"
        title="Reserve Your Table"
        subtitle="Join us for an evening of extraordinary cuisine. Reservations recommended."
        accent={ACCENT}
        buttonLabel="Make a Reservation"
        details={[
          { icon: Clock, text: "Tue–Sun, 6pm–11pm" },
          { icon: Phone, text: "(555) 789-TABLE" },
          { icon: MapPin, text: "45 Gold Avenue, Downtown, NY 10001" },
        ]}
      />

      <DemoFooter name="Saffron Table" icon={UtensilsCrossed} tagline="Tradition meets innovation, every evening" accent={ACCENT} />
    </div>
  );
}
