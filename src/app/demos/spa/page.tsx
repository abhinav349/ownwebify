import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Italiana, Karla } from "next/font/google";
import { Flower2, MapPin, Clock, Phone } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/spa/hero";
import { Offerings } from "@/components/demos/spa/offerings";
import { Story } from "@/components/demos/spa/story";
import { Showcase } from "@/components/demos/spa/showcase";

const ACCENT = "#9fb89a";

export const metadata: Metadata = {
  title: "Willow & Stone | Spa & Wellness Retreat — Website Demo",
  description:
    "A calm spa and wellness retreat demo site with a treatment menu, booking flow, and a scroll-driven cinematic experience. See how OwnWebify designs websites for spas and wellness studios.",
  alternates: { canonical: "https://ownwebify.com/demos/spa" },
  openGraph: {
    title: "Willow & Stone - Spa & Wellness Website Demo",
    description: "Cinematic demo website for a spa and wellness retreat, built by OwnWebify.",
    url: "https://ownwebify.com/demos/spa",
  },
};

const italiana = Italiana({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const karla = Karla({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const offerings = ["MASSAGE", "THERMAL POOLS", "BOTANICAL FACIALS", "FOREST BATHING", "QUIET ROOMS", "DAY RETREATS"];

export default function SpaDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#101410] text-[#eef2ea] ${italiana.variable} ${karla.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#101410" } as CSSProperties}
    >
      <DemoSeo
        name="Willow & Stone"
        type="Spa & Wellness Retreat"
        slug="spa"
        description="A spa and wellness retreat website demo with a treatment menu, cinematic scroll storytelling, and a calm sage palette."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Willow & Stone"
        icon={Flower2}
        accent={ACCENT}
        ctaLabel="Book"
        links={[
          { href: "#treatments", label: "Treatments" },
          { href: "#about", label: "The Retreat" },
          { href: "#contact", label: "Visit" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {offerings.map((offering) => (
            <span key={offering} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {offering}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Story />
      <Showcase />

      <Testimonials
        eyebrow="Guest Reflections"
        title="What Our Guests Say"
        accent={ACCENT}
        items={[
          { text: "I've been to spas that felt like airports. This felt like someone's very calm home.", author: "Rebecca L.", rating: 5 },
          { text: "The forest walk was the part I expected least and think about most.", author: "Wellness Review", rating: 5 },
          { text: "Eighteen guests a day makes all the difference. You genuinely never see a queue.", author: "Marcus & Ines T.", rating: 5 },
        ]}
      />

      <DemoCta
        id="contact"
        eyebrow="Come Rest"
        title="Book Your Treatment"
        subtitle="Same-week appointments are usually available. Day retreats book a few weeks ahead."
        accent={ACCENT}
        buttonLabel="Check Availability"
        details={[
          { icon: Clock, text: "Wed–Sun 9am–7pm" },
          { icon: Phone, text: "(555) 620-CALM" },
          { icon: MapPin, text: "Willow Lane, Ashcombe Valley" },
        ]}
      />

      <DemoFooter name="Willow & Stone" icon={Flower2} tagline="An hour that belongs to you" accent={ACCENT} />
    </div>
  );
}
