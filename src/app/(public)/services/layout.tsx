import type { Metadata } from "next";
import { ServiceJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Web Development Pricing | Affordable Websites from ₹8,000",
  description:
    "Transparent pricing for professional web development. Landing pages from ₹8,000, business websites from ₹17,000, e-commerce from ₹25,000. No hidden fees. Modern tech, fast delivery.",
  openGraph: {
    title: "Web Development Pricing - Affordable Packages",
    description:
      "Professional websites starting at ₹8,000. Transparent pricing, no hidden fees. Landing pages, business sites, e-commerce, and custom web apps.",
    url: "https://ownwebify.com/services",
  },
};

const services = [
  {
    name: "Landing Page Development",
    description: "A high-converting single page that turns visitors into leads. Includes responsive design, SEO optimization, and analytics.",
    price: 99,
  },
  {
    name: "Business Website Development",
    description: "A complete multi-page website that showcases your brand professionally with CMS, blog, and full SEO optimization.",
    price: 199,
  },
  {
    name: "E-Commerce Website Development",
    description: "A full online store with payments, inventory management, order tracking, and customer accounts.",
    price: 299,
  },
  {
    name: "Custom Web Application Development",
    description: "Custom web apps with user authentication, database design, API development, and third-party integrations.",
    price: 399,
  },
];

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceJsonLd services={services} />
      {children}
    </>
  );
}
