import Image from "next/image";
import { Users, Maximize } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#e8a87c";

const rooms = [
  {
    name: "Ocean View Suite",
    rate: "$420",
    sleeps: "2 guests",
    size: "58 m²",
    desc: "Floor-to-ceiling glass over the bay, a deep soaking tub, and a private terrace for breakfast.",
    image: demoImages.hotel.room,
  },
  {
    name: "Garden Bungalow",
    rate: "$310",
    sleeps: "2-3 guests",
    size: "46 m²",
    desc: "Tucked into the olive grove, with an outdoor shower and a shaded reading porch.",
    image: demoImages.hotel.exterior,
  },
  {
    name: "The Presidential",
    rate: "$880",
    sleeps: "4 guests",
    size: "120 m²",
    desc: "Two bedrooms, a private plunge pool, and a dedicated host for the length of your stay.",
    image: demoImages.hotel.lobby,
  },
];

export function Offerings() {
  return (
    <section id="rooms" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Rooms &amp; Suites</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Forty-two ways to stay</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.08}>
          {rooms.map((room) => {
            const photo = img(room.image, 700, 75);
            return (
              <StaggerItem key={room.name} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <p className="absolute bottom-3 right-3 font-display text-xl text-white">
                    {room.rate}
                    <span className="text-xs text-white/60"> / night</span>
                  </p>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-xl">{room.name}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {room.sleeps}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="h-3.5 w-3.5" /> {room.size}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/50 leading-relaxed">{room.desc}</p>
                  <button
                    className="mt-4 text-xs uppercase tracking-wider transition-opacity hover:opacity-70"
                    style={{ color: ACCENT }}
                  >
                    Reserve this room →
                  </button>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
