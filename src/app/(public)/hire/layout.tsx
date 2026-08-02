import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Start Your Project | Get a Free Quote in 48 Hours",
  description:
    "Submit your website project and get a free custom quote within 48 hours. Affordable web development starting at ₹5,000. No commitment required.",
  alternates: { canonical: "https://ownwebify.com/hire" },
  openGraph: {
    title: "Start Your Web Development Project - Free Quote",
    description:
      "Tell us about your project and get a free quote within 48 hours. Affordable, professional web development.",
    url: "https://ownwebify.com/hire",
  },
};

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://ownwebify.com" },
          { name: "Start a Project", url: "https://ownwebify.com/hire" },
        ]}
      />
      {children}
    </>
  );
}
