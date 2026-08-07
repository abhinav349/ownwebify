import { type CurrencyCode, formatDisplayPrice } from "@/lib/pricing";

/**
 * The homepage FAQ, defined once.
 *
 * This list is consumed twice: `FaqSection` renders it as visible copy, and
 * `FAQJsonLd` emits the same entries as FAQPage structured data. It used to be
 * typed out separately in each, and the two copies drifted — the markup
 * claimed a "50% off" launch offer against the page's "up to 71% off", and
 * ₹3,300/month maintenance against a rendered ₹2,040. Structured data that
 * contradicts the visible page is a rich-results violation, so a copy-paste
 * was quietly putting the FAQ snippet at risk.
 *
 * Taking a currency rather than hardcoding one keeps the visible copy
 * geo-priced while letting the JSON-LD pin itself to DEFAULT_CURRENCY, which
 * is what the prerendered HTML — and therefore a crawler — actually shows.
 */
export function getFaqs(currency: CurrencyCode) {
  const p = (amount: number) => formatDisplayPrice(amount, currency);

  return [
    {
      question: "How much does it cost to build a website?",
      answer: `Our website development starts at just ${p(59)} for a landing page. Business websites start at ${p(118)}, e-commerce at ${p(235)}, and custom web applications at ${p(353)}. All prices are transparent with no hidden fees — and we're currently running a launch offer with up to 71% off.`,
    },
    {
      question: "How long does it take to build a website?",
      answer:
        "A landing page takes about 1 week, a business website 2-3 weeks, e-commerce 4-6 weeks, and custom web apps 6-10 weeks. We provide regular updates throughout the process.",
    },
    {
      question: "Do you offer affordable website development for small businesses?",
      answer: `Yes! We specialize in affordable, professional websites for small businesses and startups. Our pricing starts at ${p(59)} and we offer flexible packages to fit any budget.`,
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
      answer: `Yes, every project includes 30 days of free post-launch support. We also offer ongoing monthly maintenance plans starting at ${p(24)}/month for updates, security patches, and performance monitoring.`,
    },
  ];
}
