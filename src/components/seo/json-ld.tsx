import { currencies } from "@/lib/pricing";

/** Same PPP-adjusted INR display rate the site's pricing UI uses. */
const INR_PER_USD = currencies.INR.displayRate;

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    // ProfessionalService (a LocalBusiness subtype) rather than plain
    // Organization: this is a service business people search for by
    // location + service, and it lets areaServed/priceRange carry weight.
    "@type": "ProfessionalService",
    "@id": "https://ownwebify.com/#organization",
    name: "OwnWebify",
    url: "https://ownwebify.com",
    // Google's logo guidelines only accept raster (jpg/png/gif) - the previous
    // favicon.svg silently made this field unusable. /logo.png is generated.
    logo: {
      "@type": "ImageObject",
      url: "https://ownwebify.com/logo.png",
      width: 512,
      height: 512,
    },
    image: "https://ownwebify.com/logo.png",
    description:
      "Affordable professional web development services starting at ₹5,000. Custom websites, e-commerce stores, and web applications.",
    founder: {
      "@type": "Person",
      name: "Abhi",
      jobTitle: "Full-Stack Web Developer",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
    ],
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "E-Commerce Development",
      "SEO",
      "Web Design",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "admin@ownwebify.com",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://www.instagram.com/ownwebify",
      "https://github.com/abhinav349",
    ],
    priceRange: "₹5,000 - ₹30,000",
  };

  return <JsonLd data={data} />;
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://ownwebify.com/#website",
    name: "OwnWebify",
    url: "https://ownwebify.com",
    description:
      "Get affordable, professional websites built with modern technology. Starting at just ₹5,000.",
    publisher: { "@id": "https://ownwebify.com/#organization" },
    inLanguage: "en",
    // No `potentialAction`/SearchAction: the site has no search endpoint, and
    // the previous one pointed at /services with no {search_term_string}
    // placeholder, making it invalid markup Google would discard anyway.
  };

  return <JsonLd data={data} />;
}

export function ServiceJsonLd({
  services,
}: {
  services: { name: string; description: string; price: number }[];
}) {
  const data = services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web Development",
    name: service.name,
    description: service.description,
    provider: { "@id": "https://ownwebify.com/#organization" },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    // These are "starting from" prices, so a flat `price` would overstate
    // precision. minPrice on a PriceSpecification is the accurate shape.
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        // Rounded to the round figure the page actually advertises ("from
        // ₹5,000", not ₹5,015) - structured data that disagrees with visible
        // content is a rich-results violation.
        minPrice: Math.round((service.price * INR_PER_USD) / 1000) * 1000,
        priceCurrency: "INR",
        valueAddedTaxIncluded: true,
      },
    },
  }));

  return (
    <>
      {data.map((item, i) => (
        <JsonLd key={i} data={item} />
      ))}
    </>
  );
}

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Abhi",
    url: "https://ownwebify.com/about",
    jobTitle: "Full-Stack Web Developer",
    worksFor: {
      "@type": "Organization",
      name: "OwnWebify",
      url: "https://ownwebify.com",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Web Development",
      "UI/UX Design",
      "E-Commerce",
      "PostgreSQL",
    ],
    sameAs: [
      "https://www.instagram.com/ownwebify",
      "https://github.com/abhinav349",
    ],
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

export function CreativeWorkJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    creator: {
      "@type": "Organization",
      name: "OwnWebify",
      url: "https://ownwebify.com",
    },
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}
