import Image from "next/image";
import { Bed, Bath, Maximize } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#d4af61";

const gallery = [
  demoImages.realEstate.hero,
  demoImages.realEstate.living,
  demoImages.realEstate.exterior,
  demoImages.realEstate.interior,
  demoImages.realEstate.lounge,
  demoImages.realEstate.hero,
];

const properties = [
  { name: "Skyline Penthouse", location: "Downtown, Manhattan", price: "$4.2M", beds: 4, baths: 3, sqft: "3,200", tag: "Featured" },
  { name: "Harbor View Condo", location: "Waterfront, Brooklyn", price: "$1.8M", beds: 2, baths: 2, sqft: "1,450", tag: "New" },
  { name: "Park Avenue Classic", location: "Upper East Side", price: "$6.5M", beds: 5, baths: 4, sqft: "4,800", tag: null },
  { name: "Chelsea Loft", location: "Chelsea, Manhattan", price: "$2.1M", beds: 3, baths: 2, sqft: "2,100", tag: "Hot" },
  { name: "Riverside Villa", location: "Hudson Valley", price: "$3.8M", beds: 6, baths: 5, sqft: "5,500", tag: null },
  { name: "Modern Studio+", location: "Williamsburg, Brooklyn", price: "$950K", beds: 1, baths: 1, sqft: "780", tag: "New" },
];

export function Offerings() {
  return (
    <section id="listings" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Current Listings</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Featured Properties</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.07}>
          {properties.map((property, i) => {
            const photo = img(gallery[i], 700, 75);
            return (
              <StaggerItem key={property.name} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {property.tag && (
                    <span
                      className="absolute top-3 left-3 text-[0.65rem] uppercase tracking-wider px-2.5 py-1 rounded-sm"
                      style={{ backgroundColor: ACCENT, color: "#0a0f14" }}
                    >
                      {property.tag}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <p className="absolute bottom-3 right-3 font-display text-xl text-white">{property.price}</p>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-lg">{property.name}</h3>
                  <p className="text-sm text-white/40 mt-1">{property.location}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {property.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.baths}</span>
                    <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" /> {property.sqft} sqft</span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
