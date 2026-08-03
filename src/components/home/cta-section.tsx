import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { GeoPrice } from "@/components/shared/geo-price";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { Reveal } from "@/components/demos/shared/reveal";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 px-8 py-20 text-center shadow-2xl sm:px-16 animate-gradient">
            <div className="aurora-bg opacity-40">
              <div className="aurora-layer" />
            </div>
            <div className="noise-overlay" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to Get Your Affordable Website?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
                Agency-quality website development starting at <GeoPrice amount={59} />.
                Free custom quote within 48 hours — no commitment, no pressure.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                <Magnetic strength={0.3}>
                  <Link
                    href="/hire"
                    className={cn(
                      buttonVariants({ size: "xl" }),
                      "rounded-full bg-white text-primary hover:bg-white/90 shadow-xl"
                    )}
                  >
                    Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Magnetic>
              </div>
              <p className="mt-6 text-sm text-white/60">
                Free quote within 48 hours. No strings attached.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
