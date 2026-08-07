import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OwnWebify | Affordable Website Development Starting at ₹5,000",
    template: "%s | OwnWebify",
  },
  description:
    "Get a professional, high-performance website at affordable prices. Agency-quality web development starting at just ₹5,000. Modern design, fast delivery, 100% code ownership.",
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
    title: "OwnWebify | Affordable Website Development Starting at ₹5,000",
    description:
      "Professional websites at budget-friendly prices. Custom design, modern tech stack, and lightning-fast performance. Starting at just ₹5,000.",
    // NOTE: deliberately no `images` here, in either block. Both used to point
    // at /og-image.png, which does not exist in public/ — og:image survived
    // only because file-based metadata (app/opengraph-image.tsx) outranks the
    // metadata object, but twitter:image is resolved separately and shipped
    // the 404, so every share on X rendered imageless.
    //
    // Leaving both unset is what makes this cascade correctly: Next fills
    // og:image from the nearest opengraph-image file, then fills twitter's
    // images from the *resolved* og:image. So each /demos/* route, which has
    // its own opengraph-image.tsx, now gets its own Twitter card too —
    // something a root twitter-image.tsx would have overridden with the
    // generic OwnWebify card.
  },
  twitter: {
    card: "summary_large_image",
    title: "OwnWebify | Affordable Website Development Starting at ₹5,000",
    description:
      "Professional websites at budget-friendly prices. Starting at just ₹5,000.",
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
  // NOTE: deliberately no `alternates.canonical` here. Next.js inherits parent
  // metadata into child segments, so a canonical set at the root made every
  // page declare itself a duplicate of the homepage, which tells Google not to
  // index /about, /services, /hire etc. separately. Each page sets its own.
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
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4N747N7JJG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4N747N7JJG');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
