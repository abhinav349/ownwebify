import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Outfit, Manrope } from "next/font/google";
import { Stethoscope, MapPin, Clock, Phone } from "lucide-react";
import { DemoNav } from "@/components/demos/shared/demo-nav";
import { DemoFooter } from "@/components/demos/shared/demo-footer";
import { DemoCta } from "@/components/demos/shared/demo-cta";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { Testimonials } from "@/components/demos/shared/testimonials";
import { Marquee } from "@/components/demos/shared/marquee";
import { DemoSeo } from "@/components/demos/shared/demo-seo";
import { Hero } from "@/components/demos/clinic/hero";
import { Offerings } from "@/components/demos/clinic/offerings";
import { Doctors } from "@/components/demos/clinic/doctors";
import { Story } from "@/components/demos/clinic/story";
import { Showcase } from "@/components/demos/clinic/showcase";

const ACCENT = "#4fd1c5";

export const metadata: Metadata = {
  title: "CarePlus Medical | Healthcare Clinic — Website Demo",
  description:
    "A calm, trustworthy healthcare clinic demo site with soothing teal tones, physician profiles, and a scroll-driven cinematic experience.",
  alternates: { canonical: "https://ownwebify.com/demos/clinic" },
  openGraph: {
    title: "CarePlus Medical - Healthcare Clinic Website Demo",
    description: "Cinematic demo website for a healthcare clinic, built by OwnWebify.",
    url: "https://ownwebify.com/demos/clinic",
  },
};

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const departments = ["FAMILY MEDICINE", "PEDIATRICS", "DENTAL CARE", "WOMEN'S HEALTH", "DIAGNOSTICS", "PHYSIOTHERAPY"];

export default function ClinicDemoPage() {
  return (
    <div
      className={`demo-page min-h-screen bg-[#0a1210] text-[#eaf3f0] ${outfit.variable} ${manrope.variable}`}
      style={{ "--accent": ACCENT, "--bg": "#0a1210" } as CSSProperties}
    >
      <DemoSeo
        name="CarePlus Medical"
        type="Healthcare Clinic"
        slug="clinic"
        description="A healthcare clinic website demo with services, physician profiles, appointment booking, and cinematic scroll storytelling in a calm teal palette."
      />
      <div className="demo-grain" />
      <DemoCursor accent={ACCENT} />
      <DemoNav
        name="CarePlus Medical"
        icon={Stethoscope}
        accent={ACCENT}
        ctaLabel="Book Visit"
        links={[
          { href: "#services", label: "Services" },
          { href: "#team", label: "Doctors" },
          { href: "#about", label: "About" },
        ]}
      />

      <Hero />

      <div className="border-y border-white/10 py-6">
        <Marquee>
          {departments.map((department) => (
            <span key={department} className="mx-8 flex items-center gap-8 text-sm tracking-[0.3em] text-white/30">
              {department}
              <span style={{ color: ACCENT }}>&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Offerings />
      <Doctors />
      <Story />
      <Showcase />

      <Testimonials
        eyebrow="Patient Stories"
        title="What Our Patients Say"
        accent={ACCENT}
        items={[
          { text: "First doctor's office where I didn't feel rushed. Dr. Mitchell actually listens.", author: "Grace H.", rating: 5 },
          { text: "Got a same-day appointment and diagnostic results before I even left. Incredible.", author: "Daniel O.", rating: 5 },
          { text: "The pediatric team put my daughter completely at ease. We won't go anywhere else.", author: "Priya & family", rating: 5 },
        ]}
      />

      <DemoCta
        id="contact"
        eyebrow="We're Here For You"
        title="Book Your Appointment"
        subtitle="Same-day visits available. Our care coordinators are ready to help you get seen."
        accent={ACCENT}
        buttonLabel="Schedule a Visit"
        details={[
          { icon: Clock, text: "Mon–Sat 7am–8pm" },
          { icon: Phone, text: "(555) 300-CARE" },
          { icon: MapPin, text: "500 Wellness Ave, Riverside" },
        ]}
      />

      <DemoFooter name="CarePlus Medical" icon={Stethoscope} tagline="Care that feels human again" accent={ACCENT} />
    </div>
  );
}
