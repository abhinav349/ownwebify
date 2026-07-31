import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Playfair_Display, Jost } from "next/font/google";
import { Sparkles, MapPin, Clock, Phone } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { Hero } from "@/components/demos/salon/hero";
import { Offerings } from "@/components/demos/salon/offerings";
import { Story } from "@/components/demos/salon/story";
import { Team } from "@/components/demos/salon/team";
import { Showcase } from "@/components/demos/salon/showcase";

const ACCENT = "#e3aab4";

export const metadata: Metadata = {
  title: "Glow Studio | Beauty Salon — Website Demo",
  description:
    "A premium beauty salon demo site with a soft feminine aesthetic, service menu, stylist team, and a scroll-driven cinematic experience.",
  openGraph: {
    title: "Glow Studio - Beauty Salon Website Demo",
    description: "Cinematic demo website for a beauty salon, built by OwnWebify.",
    url: "https://ownwebify.com/demos/salon",
  },
};

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const categories = ["HAIR", "COLOR", "SKIN", "LASHES", "BRIDAL", "NAILS"];

export default function SalonDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#180f12] text-[#f6ecee] ${playfair.variable} ${jost.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#180f12" } as CSSProperties}
    >
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="Glow Studio"
        icon={Sparkles}
        accent={ACCENT}
        ctaLabel="Book Now"
        links={[
          { href: "#services", label: "Services" },
          { href: "#team", label: "Team" },
          { href: "#contact", label: "Contact" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {categories.map((category) => (
            <span key={category} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {category}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Story />
      <Team />
      <Showcase />

      <Testimonials
        eyebrow="Client Love"
        title="Straight From Our Clients"
        accent={ACCENT}
        items={[
          { text: "Best balayage I've ever had. The whole afternoon felt like a spa retreat.", author: "Meera S.", rating: 5 },
          { text: "Glow Studio doesn't just do hair — they make you feel like the best version of yourself.", author: "Anika R.", rating: 5 },
          { text: "Booked for a bridal trial and stayed for everything else. Impeccable service.", author: "The Beauty Edit", rating: 5 },
        ]}
      />

      <DemoCta
        id="contact"
        eyebrow="Ready to Glow?"
        title="Book Your Visit"
        subtitle="Step into a world of beauty and relaxation — your appointment is one click away."
        accent={ACCENT}
        buttonLabel="Book Appointment"
        details={[
          { icon: MapPin, text: "88 Rose Lane, Beauty District" },
          { icon: Clock, text: "Tue–Sat 9am–7pm" },
          { icon: Phone, text: "(555) 456-GLOW" },
        ]}
      />

      <DemoFooter name="Glow Studio" icon={Sparkles} tagline="Beauty and self-care, made ritual" accent={ACCENT} />
    </div>
  );
}
