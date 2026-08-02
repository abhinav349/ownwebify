import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Spectral, Inter } from "next/font/google";
import { Scale, MapPin, Clock, Phone } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/law-firm/hero";
import { Offerings } from "@/components/demos/law-firm/offerings";
import { Story } from "@/components/demos/law-firm/story";
import { Attorneys } from "@/components/demos/law-firm/attorneys";
import { Showcase } from "@/components/demos/law-firm/showcase";

const ACCENT = "#9fb3c8";

export const metadata: Metadata = {
  title: "Whitmore & Cole | Law Firm — Website Demo",
  description:
    "A professional law firm demo site with practice areas, attorney profiles, and a scroll-driven cinematic experience. See how OwnWebify designs websites that build credibility for legal practices.",
  alternates: { canonical: "https://ownwebify.com/demos/law-firm" },
  openGraph: {
    title: "Whitmore & Cole - Law Firm Website Demo",
    description: "Cinematic demo website for a law practice, built by OwnWebify.",
    url: "https://ownwebify.com/demos/law-firm",
  },
};

const spectral = Spectral({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const areas = ["CORPORATE", "FAMILY LAW", "REAL ESTATE", "LITIGATION", "EMPLOYMENT", "ESTATE PLANNING"];

export default function LawFirmDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#0d1117] text-[#e8edf2] ${spectral.variable} ${inter.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#0d1117" } as CSSProperties}
    >
      <DemoSeo
        name="Whitmore & Cole"
        type="Law Firm"
        slug="law-firm"
        description="A law firm website demo with practice areas, attorney profiles, and cinematic scroll storytelling in a cool slate palette."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Whitmore & Cole"
        icon={Scale}
        accent={ACCENT}
        ctaLabel="Consult"
        links={[
          { href: "#practice", label: "Practice Areas" },
          { href: "#team", label: "Attorneys" },
          { href: "#about", label: "The Firm" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {areas.map((area) => (
            <span key={area} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {area}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Story />
      <Attorneys />
      <Showcase />

      <Testimonials
        eyebrow="Client Outcomes"
        title="What Our Clients Say"
        accent={ACCENT}
        items={[
          { text: "They told me honestly that I had a weak case, and saved me two years of litigation.", author: "Former client, corporate matter", rating: 5 },
          { text: "Eleanor handled our acquisition end to end. Nothing slipped, nothing surprised us.", author: "R. Okonkwo, CEO", rating: 5 },
          { text: "Difficult circumstances handled with real decency. I never felt like a case number.", author: "Family law client", rating: 5 },
        ]}
      />

      <DemoCta
        id="contact"
        eyebrow="No Obligation"
        title="Request a Consultation"
        subtitle="First consultations are free. We'll tell you plainly whether you need us - and whether you don't."
        accent={ACCENT}
        buttonLabel="Book a Consultation"
        details={[
          { icon: Clock, text: "Mon–Fri 8:30am–6pm" },
          { icon: Phone, text: "(555) 118-LEGAL" },
          { icon: MapPin, text: "400 Chancery Plaza, Suite 1200" },
        ]}
      />

      <DemoFooter name="Whitmore & Cole" icon={Scale} tagline="Counsel that holds under pressure" accent={ACCENT} />
    </div>
  );
}
