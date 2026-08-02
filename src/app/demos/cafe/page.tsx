import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Fraunces, Work_Sans } from "next/font/google";
import { Coffee, MapPin, Clock, Phone } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/cafe/hero";
import { Offerings } from "@/components/demos/cafe/offerings";
import { Story } from "@/components/demos/cafe/story";
import { Showcase } from "@/components/demos/cafe/showcase";

const ACCENT = "#c8873f";

export const metadata: Metadata = {
  title: "Brew & Bean | Artisan Coffee Roasters — Website Demo",
  description:
    "A cozy artisan coffee shop demo site with warm earthy tones, single-origin coffee, and a scroll-driven cinematic experience.",
  alternates: { canonical: "https://ownwebify.com/demos/cafe" },
  openGraph: {
    title: "Brew & Bean - Coffee Shop Website Demo",
    description: "Cinematic demo website for an artisan coffee shop, built by OwnWebify.",
    url: "https://ownwebify.com/demos/cafe",
  },
};

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const origins = ["ETHIOPIA", "COLOMBIA", "SUMATRA", "GUATEMALA", "KENYA", "BRAZIL", "HONDURAS", "COSTA RICA"];

export default function CafeDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#120d0a] text-[#f3ece1] ${fraunces.variable} ${workSans.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#120d0a" } as CSSProperties}
    >
      <DemoSeo
        name="Brew & Bean"
        type="Coffee Shop"
        slug="cafe"
        description="An artisan coffee shop website demo with a menu, story section, and cinematic scroll storytelling in a warm amber palette."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Brew & Bean"
        icon={Coffee}
        accent={ACCENT}
        ctaLabel="Order Online"
        links={[
          { href: "#menu", label: "Menu" },
          { href: "#about", label: "Our Story" },
          { href: "#visit", label: "Visit Us" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {origins.map((origin) => (
            <span key={origin} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {origin}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Story />
      <Showcase />

      <Testimonials
        eyebrow="Loved Locally"
        title="What Our Regulars Say"
        accent={ACCENT}
        items={[
          { text: "The best pour-over in the city — hands down. It feels like a ritual every time.", author: "City Eats Weekly", rating: 5 },
          { text: "Brew & Bean turned my Monday mornings into something I actually look forward to.", author: "Priya N.", rating: 5 },
          { text: "Ethically sourced, beautifully roasted, and the space itself is a small escape.", author: "The Local Grind", rating: 5 },
        ]}
      />

      <DemoCta
        id="visit"
        eyebrow="Come Say Hello"
        title="Visit Us Today"
        subtitle="Stop by for a slow morning, a working afternoon, or a quiet evening pour."
        accent={ACCENT}
        buttonLabel="Get Directions"
        details={[
          { icon: Clock, text: "Mon–Fri 6am–8pm · Weekends 7am–9pm" },
          { icon: Phone, text: "(555) 123-BREW" },
          { icon: MapPin, text: "123 Bean Street, Brewtown, CA 90210" },
        ]}
      />

      <DemoFooter name="Brew & Bean" icon={Coffee} tagline="Small-batch roasted, every single morning" accent={ACCENT} />
    </div>
  );
}
