import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Coffee,
  UtensilsCrossed,
  Dumbbell,
  ShoppingBag,
  Building2,
  Stethoscope,
} from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { img, demoImages } from "@/lib/demos/images";

const featured = [
  {
    slug: "cafe",
    name: "Brew & Bean",
    type: "Coffee Shop",
    icon: Coffee,
    accent: "#c8873f",
    image: demoImages.cafe.interior,
  },
  {
    slug: "restaurant",
    name: "Saffron Table",
    type: "Fine Dining",
    icon: UtensilsCrossed,
    accent: "#caa25a",
    image: demoImages.restaurant.hero,
  },
  {
    slug: "fitness",
    name: "IronPulse",
    type: "Gym & Fitness",
    icon: Dumbbell,
    accent: "#b6ff3c",
    image: demoImages.fitness.hero,
  },
  {
    slug: "ecommerce",
    name: "Velvet & Thread",
    type: "Fashion Store",
    icon: ShoppingBag,
    accent: "#e8e6e1",
    image: demoImages.ecommerce.editorial,
  },
  {
    slug: "real-estate",
    name: "Skyline Properties",
    type: "Real Estate",
    icon: Building2,
    accent: "#d4af61",
    image: demoImages.realEstate.hero,
  },
  {
    slug: "clinic",
    name: "CarePlus Medical",
    type: "Healthcare Clinic",
    icon: Stethoscope,
    accent: "#4fd1c5",
    image: demoImages.clinic.hero,
  },
];

export function FeaturedWorkSection() {
  return (
    <section className="py-24 relative" id="work">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Featured Work
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Concept Builds Across{" "}
            <span className="gradient-text">Every Industry</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Live, interactive demo sites — built to show what&apos;s possible for your
            industry before you commit to anything.
          </p>
        </Reveal>

        <StaggerGroup
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          stagger={0.08}
        >
          {featured.map((item) => {
            const cover = img(item.image, 640, 75);
            return (
              <StaggerItem key={item.slug}>
                <Magnetic strength={0.1} className="block h-full">
                  <Link
                    href={`/demos/${item.slug}`}
                    className="tilt-card group block h-full rounded-2xl border bg-card overflow-hidden"
                  >
                    {/* Browser chrome */}
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-muted/40">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                    </div>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className="absolute inset-0 opacity-30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-15"
                        style={{ backgroundColor: item.accent }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className="h-4 w-4" style={{ color: item.accent }} />
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {item.type}
                        </p>
                      </div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Explore Live Demo{" "}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </Link>
                </Magnetic>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <div className="mt-12 text-center">
          <Magnetic strength={0.25} className="inline-block">
            <Link
              href="/demos"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Explore all demos <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
