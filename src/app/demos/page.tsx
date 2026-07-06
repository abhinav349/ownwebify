import Link from "next/link";
import { ArrowRight, Coffee, UtensilsCrossed, Scissors, Dumbbell, ShoppingBag, Building2, Camera, Stethoscope } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const demos = [
  {
    slug: "cafe",
    name: "Brew & Bean",
    type: "Coffee Shop",
    icon: Coffee,
    gradient: "from-amber-700 to-yellow-600",
    bg: "from-amber-50 to-orange-50",
    description: "A cozy artisan coffee shop with warm earthy tones.",
  },
  {
    slug: "restaurant",
    name: "Saffron Table",
    type: "Fine Dining",
    icon: UtensilsCrossed,
    gradient: "from-rose-900 to-amber-700",
    bg: "from-rose-50 to-amber-50",
    description: "Elegant fine dining with a luxurious burgundy & gold palette.",
  },
  {
    slug: "salon",
    name: "Glow Studio",
    type: "Beauty Salon",
    icon: Scissors,
    gradient: "from-pink-400 to-purple-500",
    bg: "from-pink-50 to-purple-50",
    description: "Premium beauty salon with a soft feminine aesthetic.",
  },
  {
    slug: "fitness",
    name: "IronPulse",
    type: "Gym & Fitness",
    icon: Dumbbell,
    gradient: "from-lime-400 to-green-600",
    bg: "from-gray-900 to-gray-800",
    description: "Bold energetic gym with neon green accents on dark.",
  },
  {
    slug: "ecommerce",
    name: "Velvet & Thread",
    type: "Fashion Store",
    icon: ShoppingBag,
    gradient: "from-gray-900 to-gray-700",
    bg: "from-gray-50 to-white",
    description: "Minimalist high-fashion e-commerce with clean lines.",
  },
  {
    slug: "real-estate",
    name: "Skyline Properties",
    type: "Real Estate",
    icon: Building2,
    gradient: "from-blue-800 to-teal-600",
    bg: "from-blue-50 to-teal-50",
    description: "Professional real estate with a trustworthy navy palette.",
  },
  {
    slug: "photography",
    name: "Lens & Light",
    type: "Photography Studio",
    icon: Camera,
    gradient: "from-gray-800 to-gray-600",
    bg: "from-gray-100 to-gray-50",
    description: "Artistic minimal photography portfolio in monochrome.",
  },
  {
    slug: "clinic",
    name: "CarePlus Medical",
    type: "Healthcare Clinic",
    icon: Stethoscope,
    gradient: "from-sky-500 to-emerald-500",
    bg: "from-sky-50 to-emerald-50",
    description: "Calm and trustworthy clinic with soothing blue-green tones.",
  },
];

export default function DemosIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="py-8 px-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="font-bold text-lg tracking-tight text-gray-900">OwnWebify</span>
          </Link>
          <Link
            href="/hire"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg"
          >
            Start Your Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-12 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-4">
            Live Demos
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Websites That Speak{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Industry
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Every business is unique. Explore these live demos to see how we craft
            tailored designs for different industries — each with its own personality.
          </p>
        </div>
      </section>

      {/* Demo Grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demos.map((demo) => (
            <Link
              key={demo.slug}
              href={`/demos/${demo.slug}`}
              className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Preview gradient */}
              <div className={`h-40 bg-gradient-to-br ${demo.gradient} flex items-center justify-center relative overflow-hidden`}>
                <demo.icon className="h-12 w-12 text-white/90" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              {/* Info */}
              <div className="p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {demo.type}
                </p>
                <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {demo.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {demo.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-purple-600">
                  View Demo <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
