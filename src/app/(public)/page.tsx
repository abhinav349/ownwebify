import type { Metadata } from "next";
import { FaqSection } from "@/components/shared/faq-section";
import { getFaqs } from "@/lib/faqs";
import { DEFAULT_CURRENCY } from "@/lib/pricing";
import { OrganizationJsonLd, WebsiteJsonLd, FAQJsonLd } from "@/components/seo/json-ld";
import { Reveal } from "@/components/demos/shared/reveal";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { ServicesSection } from "@/components/home/services-section";
import { ProcessSection } from "@/components/home/process-section";
import { FeaturedWorkSection } from "@/components/home/featured-work-section";
import { TechStackSection } from "@/components/home/tech-stack-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";

// Revalidate hourly so newly published testimonials show up without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  // `absolute` so the root layout's "%s | OwnWebify" template doesn't append a
  // second brand suffix to a title that already ends in one.
  title: {
    absolute: "Affordable Website Development | Custom Websites from ₹5,000",
  },
  description:
    "Get a professional, high-performance website at affordable prices. Agency-quality web development starting at just ₹5,000. Modern design, fast delivery, SEO optimized, 100% code ownership.",
  alternates: { canonical: "https://ownwebify.com" },
  openGraph: {
    title: "Affordable Website Development | Custom Websites from ₹5,000",
    description:
      "Professional websites built with modern technology at budget-friendly prices. Landing pages from ₹5,000, business sites from ₹10,000.",
    url: "https://ownwebify.com",
  },
};

// Built with DEFAULT_CURRENCY, not the visitor's: `FaqSection` is a client
// component whose currency arrives from a geo lookup, so the HTML a crawler is
// served always carries the default-currency prices. The markup has to describe
// that same page.
const faqs = getFaqs(DEFAULT_CURRENCY);

export default function HomePage() {
  // `overflow-x-clip`, not `overflow-hidden`: both contain the hero's off-canvas
  // bleed, but `hidden` makes this element a scroll container, and a sticky
  // descendant then pins to *it* rather than to the viewport — which silently
  // kills the pinned laptop scrub in the work section. `clip` establishes no
  // scrollport, so sticky still resolves against the page.
  return (
    <div className="overflow-x-clip">
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <FAQJsonLd faqs={faqs} />

      <HeroSection />
      <StatsSection />
      <ServicesSection />
      {/* Work sits above Process on purpose. Process is a pinned horizontal
          scroll ~2.8 viewports tall, and with it in front the laptop showcase
          did not appear until 4,964px — five and a half screens down, past the
          point most visitors stop. Proof also reads better directly after the
          services pitch than after a walkthrough of how the work gets done. */}
      <FeaturedWorkSection />
      <ProcessSection />
      <TechStackSection />
      <WhyChooseSection />
      <TestimonialsSection />

      {/* FAQ Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/30 to-background" />
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              FAQ
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our affordable web development services.
            </p>
          </Reveal>
          <FaqSection />
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
