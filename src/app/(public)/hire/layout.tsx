import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Your Project | Get a Free Quote in 48 Hours",
  description:
    "Submit your website project and get a free custom quote within 48 hours. Affordable web development starting at ₹15,000. No commitment required.",
  openGraph: {
    title: "Start Your Web Development Project - Free Quote",
    description:
      "Tell us about your project and get a free quote within 48 hours. Affordable, professional web development.",
    url: "https://ownwebify.com/hire",
  },
};

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
