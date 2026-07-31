import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#e8e6e1";

const gallery = [
  demoImages.ecommerce.editorial,
  demoImages.ecommerce.rack,
  demoImages.ecommerce.shelf,
  demoImages.ecommerce.boutique,
  demoImages.ecommerce.editorial,
  demoImages.ecommerce.rack,
];

const products = [
  { name: "Cashmere Overcoat", price: "$890", category: "Outerwear", tag: "New" },
  { name: "Silk Midi Dress", price: "$420", category: "Dresses", tag: "Bestseller" },
  { name: "Leather Tote Bag", price: "$580", category: "Accessories", tag: null },
  { name: "Merino Wool Blazer", price: "$650", category: "Suiting", tag: "New" },
  { name: "Suede Ankle Boots", price: "$490", category: "Shoes", tag: "Limited" },
  { name: "Linen Wide Trousers", price: "$280", category: "Bottoms", tag: null },
];

export function Offerings() {
  return (
    <section id="shop" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">The Edit</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">New Arrivals</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12" stagger={0.06}>
          {products.map((product, i) => {
            const photo = img(gallery[i], 600, 75);
            return (
              <StaggerItem key={product.name} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.tag && (
                    <span
                      className="absolute top-3 left-3 text-[0.6rem] uppercase tracking-wider px-2.5 py-1"
                      style={{ backgroundColor: ACCENT, color: "#0a0a0a" }}
                    >
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/35">{product.category}</p>
                  <h3 className="mt-1 text-sm md:text-base">{product.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{product.price}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
