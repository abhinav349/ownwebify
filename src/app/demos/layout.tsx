import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { SmoothScrollProvider } from "@/components/demos/providers/smooth-scroll-provider";
import "./demos.css";

export const metadata: Metadata = {
  title: "Website Portfolio | 12 Live Demo Sites by Industry",
  description:
    "Browse 12 live website demos by industry — cafes, restaurants, salons, spas, gyms, e-commerce, real estate, photography, clinics, hotels, law firms, and interior design studios. Affordable custom websites from OwnWebify.",
  keywords: [
    "website design examples",
    "small business website examples",
    "restaurant website design",
    "salon website design",
    "hotel website design",
    "law firm website design",
    "interior design website",
    "affordable website portfolio",
  ],
  alternates: { canonical: "https://ownwebify.com/demos" },
  openGraph: {
    title: "Website Portfolio - 12 Live Demos by Industry | OwnWebify",
    description:
      "See examples of professional websites we build. Affordable, cinematic designs for every industry.",
    url: "https://ownwebify.com/demos",
  },
};

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen relative">
        {children}
        {/* Floating "Built by OwnWebify" badge */}
        <Link
          href="/"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-medium shadow-xl hover:bg-black/90 transition-all hover:scale-105 border border-white/10"
        >
          <Logo size={16} />
          <span className="hidden sm:inline">Built by</span> OwnWebify
        </Link>
      </div>
    </SmoothScrollProvider>
  );
}
