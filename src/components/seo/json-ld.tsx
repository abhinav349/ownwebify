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
    "@type": "Organization",
    name: "OwnWebify",
    url: "https://ownwebify.com",
    logo: "https://ownwebify.com/favicon.svg",
    description:
      "Affordable professional web development services starting at ₹15,000. Custom websites, e-commerce stores, and web applications.",
    founder: {
      "@type": "Person",
      name: "Abhi",
      jobTitle: "Full-Stack Web Developer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressCountry: "IN",
      },
    },
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
    priceRange: "₹15,000 - ₹72,000",
  };

  return <JsonLd data={data} />;
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OwnWebify",
    url: "https://ownwebify.com",
    description:
      "Get affordable, professional websites built with modern technology. Starting at just ₹15,000.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ownwebify.com/services",
      "query-input": "required name=search_term_string",
    },
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
    provider: {
      "@type": "Organization",
      name: "OwnWebify",
      url: "https://ownwebify.com",
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    offers: {
      "@type": "Offer",
      price: service.price * 85,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
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
