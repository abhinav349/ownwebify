import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Pricing | OwnWebify",
  description: "Professional web development services from landing pages to complex web applications. Transparent pricing and fast delivery.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
