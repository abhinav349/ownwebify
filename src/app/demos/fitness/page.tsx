import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Bebas_Neue, Inter } from "next/font/google";
import { Dumbbell, MapPin, Clock, Phone } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/fitness/hero";
import { Offerings } from "@/components/demos/fitness/offerings";
import { Pricing } from "@/components/demos/fitness/pricing";
import { Story } from "@/components/demos/fitness/story";
import { Showcase } from "@/components/demos/fitness/showcase";

const ACCENT = "#b6ff3c";

export const metadata: Metadata = {
  title: "IronPulse | Gym & Fitness — Website Demo",
  description:
    "A bold, energetic gym demo site with neon accents on dark, class schedules, membership plans, and a scroll-driven cinematic experience.",
  alternates: { canonical: "https://ownwebify.com/demos/fitness" },
  openGraph: {
    title: "IronPulse - Gym & Fitness Website Demo",
    description: "Cinematic demo website for a gym & fitness studio, built by OwnWebify.",
    url: "https://ownwebify.com/demos/fitness",
  },
};

const bebas = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const tags = ["STRENGTH", "CONDITIONING", "MOBILITY", "RECOVERY", "NUTRITION", "COMMUNITY"];

export default function FitnessDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#0b0c09] text-[#eef2e8] ${bebas.variable} ${inter.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#0b0c09" } as CSSProperties}
    >
      <DemoSeo
        name="IronPulse"
        type="Gym & Fitness Studio"
        slug="fitness"
        description="A gym and fitness studio website demo with class schedules, membership pricing, and cinematic scroll storytelling in neon-on-black."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="IronPulse"
        icon={Dumbbell}
        accent={ACCENT}
        ctaLabel="Join Now"
        links={[
          { href: "#classes", label: "Classes" },
          { href: "#pricing", label: "Pricing" },
          { href: "#about", label: "About" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {tags.map((tag) => (
            <span key={tag} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {tag}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Pricing />
      <Story />
      <Showcase />

      <Testimonials
        eyebrow="Member Results"
        title="What Our Members Say"
        accent={ACCENT}
        items={[
          { text: "Dropped 30 lbs and gained a community that actually holds me accountable.", author: "Marcus D.", rating: 5 },
          { text: "The coaching here is next level — every session has a purpose.", author: "Elena V.", rating: 5 },
          { text: "Best gym I've trained at, hands down. The energy is unmatched.", author: "Fitness Weekly", rating: 5 },
        ]}
      />

      <DemoCta
        id="visit"
        eyebrow="No Excuses"
        title="Your First Session Is Free"
        subtitle="Come see what relentless actually feels like. No commitment, just results."
        accent={ACCENT}
        buttonLabel="Claim Free Session"
        details={[
          { icon: Clock, text: "Open 24/7" },
          { icon: Phone, text: "(555) 910-PULSE" },
          { icon: MapPin, text: "700 Ironside Blvd, Metro City" },
        ]}
      />

      <DemoFooter name="IronPulse" icon={Dumbbell} tagline="Train different. Every single day." accent={ACCENT} />
    </div>
  );
}
