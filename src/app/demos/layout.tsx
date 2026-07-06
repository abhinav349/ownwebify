import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Website Portfolio | Demo Sites for Cafes, Restaurants, Salons & More",
  description:
    "Browse our portfolio of affordable website designs. Demo sites for cafes, restaurants, salons, gyms, e-commerce, real estate, photography studios, and clinics.",
  openGraph: {
    title: "Website Portfolio - OwnWebify",
    description:
      "See examples of professional websites we build. Affordable designs for every industry.",
    url: "https://ownwebify.com/demos",
  },
};

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      {children}
      {/* Floating "Built by OwnWebify" badge */}
      <Link
        href="/"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-medium shadow-xl hover:bg-black/90 transition-all hover:scale-105 border border-white/10"
      >
        <Logo size={18} />
        Built by OwnWebify
      </Link>
    </div>
  );
}
