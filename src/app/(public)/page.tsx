import type { Metadata } from "next";
import { FaqSection } from "@/components/shared/faq-section";
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

const faqs = [
  {
    question: "How much does it cost to build a website?",
    answer:
      "Our website development starts at just ₹5,000 for a landing page. Business websites start at ₹10,000, e-commerce at ₹20,000, and custom web applications at ₹30,000. All prices are transparent with no hidden fees — and we're currently running a launch offer with 50% off.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "A landing page takes about 1 week, a business website 2-3 weeks, e-commerce 4-6 weeks, and custom web apps 6-10 weeks. We provide regular updates throughout the process.",
  },
  {
    question: "Do you offer affordable website development for small businesses?",
    answer:
      "Yes! We specialize in affordable, professional websites for small businesses and startups. Our pricing starts at ₹5,000 and we offer flexible packages to fit any budget.",
  },
  {
    question: "What technologies do you use to build websites?",
    answer:
      "We use modern technologies like React, Next.js, TypeScript, and Tailwind CSS for the frontend, with Node.js and PostgreSQL for the backend. This ensures fast, secure, and scalable websites.",
  },
  {
    question: "Do I own the website code after the project is complete?",
    answer:
      "Absolutely! You get 100% ownership of all code, designs, and assets. The website is completely yours — no lock-in, no recurring platform fees.",
  },
  {
    question: "Do you offer website maintenance and support?",
    answer:
      "Yes, every project includes 30 days of free post-launch support. We also offer ongoing monthly maintenance plans starting at ₹3,300/month for updates, security patches, and performance monitoring.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <FAQJsonLd faqs={faqs} />

      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <FeaturedWorkSection />
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
