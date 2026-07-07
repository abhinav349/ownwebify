import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OwnWebify | Affordable Website Development Starting at ₹15,000",
    template: "%s | OwnWebify",
  },
  description:
    "Get a professional, high-performance website at affordable prices. Agency-quality web development starting at just ₹15,000. Modern design, fast delivery, 100% code ownership.",
  keywords: [
    "affordable website development",
    "cheap website design",
    "freelance web developer",
    "budget website builder",
    "professional website cheap",
    "web development India",
    "custom website design",
    "small business website",
    "e-commerce website affordable",
    "Next.js developer",
    "website development Bengaluru",
  ],
  authors: [{ name: "Abhi", url: "https://ownwebify.com/about" }],
  creator: "OwnWebify",
  metadataBase: new URL("https://ownwebify.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ownwebify.com",
    siteName: "OwnWebify",
    title: "OwnWebify | Affordable Website Development Starting at ₹15,000",
    description:
      "Professional websites at budget-friendly prices. Custom design, modern tech stack, and lightning-fast performance. Starting at just ₹15,000.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OwnWebify - Affordable Web Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OwnWebify | Affordable Website Development Starting at ₹15,000",
    description:
      "Professional websites at budget-friendly prices. Starting at just ₹15,000.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ownwebify.com",
  },
  icons: {
    icon: "/favicon.svg",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
