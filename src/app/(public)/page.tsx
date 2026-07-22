import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Palette,
  Rocket,
  Shield,
  Zap,
  Globe,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrganizationJsonLd, WebsiteJsonLd, FAQJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Affordable Website Development | Custom Websites from ₹5,000 | OwnWebify",
  description:
    "Get a professional, high-performance website at affordable prices. Agency-quality web development starting at just ₹5,000. Modern design, fast delivery, SEO optimized, 100% code ownership.",
  openGraph: {
    title: "Affordable Website Development | Custom Websites from ₹5,000",
    description:
      "Professional websites built with modern technology at budget-friendly prices. Landing pages from ₹5,000, business sites from ₹10,000.",
    url: "https://ownwebify.com",
  },
};

const features = [
  {
    icon: Code2,
    title: "Modern Tech Stack",
    description:
      "React, Next.js, TypeScript — built with the latest tools for peak performance and scalability.",
  },
  {
    icon: Palette,
    title: "Award-Winning Design",
    description:
      "Every pixel is intentional. Designs that captivate users and convert visitors into customers.",
  },
  {
    icon: Rocket,
    title: "Lightning Fast",
    description:
      "Sub-second load times and perfect Core Web Vitals. Your site will fly.",
  },
  {
    icon: Shield,
    title: "Rock-Solid Security",
    description:
      "Enterprise-grade security with SSL, DDoS protection, and secure authentication built in.",
  },
  {
    icon: Zap,
    title: "SEO Optimized",
    description:
      "Built-in SEO best practices that help you rank higher and get discovered by your audience.",
  },
  {
    icon: Globe,
    title: "24/7 Support",
    description:
      "Ongoing maintenance and priority support to keep your site running perfectly.",
  },
];


const stats = [
  { value: "10+", label: "Projects Delivered" },
  { value: "3x", label: "Avg. Performance Boost" },
  { value: "<48h", label: "Response Time" },
  { value: "100%", label: "Code Ownership" },
];


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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl animate-float" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card/80 backdrop-blur-sm text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Available for new projects</span>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl animate-slide-up">
              Affordable Websites
              <br />
              <span className="gradient-text">That Print Money</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Agency-quality web development starting at just ₹5,000. High-converting
              digital experiences that turn visitors into customers.
            </p>

            <div className="mt-12 flex items-center justify-center gap-4 flex-wrap animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Link href="/hire">
                <Button size="xl" className="rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                  Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="xl" className="rounded-full">
                  View Services
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/30 to-background" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Budget-Friendly Web Development{" "}
              <span className="gradient-text">Without Compromise</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a premium website at affordable prices. Every project includes modern tech, fast performance, and dedicated support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="border border-border/50 bg-card/50 backdrop-blur-sm hover-lift card-shine group"
              >
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-500/10 flex items-center justify-center mb-5 group-hover:from-primary/20 group-hover:to-pink-500/20 transition-all">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Simple Process
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              From Idea to Launch in{" "}
              <span className="gradient-text">4 Steps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Share Your Vision",
                desc: "Fill out a quick form telling me about your project, goals, and timeline.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Get a Proposal",
                desc: "Within 48 hours, receive a detailed quote with clear scope and timeline.",
                icon: TrendingUp,
              },
              {
                step: "03",
                title: "Watch It Come Alive",
                desc: "Regular updates, feedback rounds, and collaboration throughout the build.",
                icon: Code2,
              },
              {
                step: "04",
                title: "Launch & Grow",
                desc: "Go live with a site that performs, converts, and grows with your business.",
                icon: Rocket,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl border bg-card hover-lift group"
              >
                <div className="text-6xl font-black text-primary/5 absolute top-4 right-4 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* What You Get Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                The Full Package
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                More Than Just a Website —{" "}
                <span className="gradient-text">A Growth Machine</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Every project includes everything you need to succeed online.
                No hidden fees, no surprise charges.
              </p>
              <ul className="space-y-4">
                {[
                  "Custom responsive design tailored to your brand",
                  "Blazing fast performance (sub-2s load times)",
                  "SEO foundation that helps you rank on Google",
                  "Conversion-optimized layouts and CTAs",
                  "Free 30-day post-launch support",
                  "Full ownership — your code, your site, forever",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/hire" className="inline-block mt-8">
                <Button size="lg" className="rounded-full shadow-lg shadow-primary/25">
                  Get Your Free Quote <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/5 via-pink-500/5 to-amber-500/5 border p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="p-6 rounded-2xl bg-card border hover-lift">
                    <TrendingUp className="h-8 w-8 text-primary mb-2" />
                    <p className="text-2xl font-bold">3x</p>
                    <p className="text-xs text-muted-foreground">More Leads</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border hover-lift mt-8">
                    <Zap className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-2xl font-bold">0.8s</p>
                    <p className="text-xs text-muted-foreground">Load Time</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border hover-lift -mt-4">
                    <Globe className="h-8 w-8 text-pink-500 mb-2" />
                    <p className="text-2xl font-bold">100</p>
                    <p className="text-xs text-muted-foreground">SEO Score</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border hover-lift mt-4">
                    <Shield className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-2xl font-bold">A+</p>
                    <p className="text-xs text-muted-foreground">Security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/30 to-background" />
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
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
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border bg-card hover-lift"
              >
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 px-8 py-20 text-center shadow-2xl sm:px-16 animate-gradient">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to Get Your Affordable Website?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
                Agency-quality website development starting at ₹5,000. Free custom quote within 48 hours — no commitment, no pressure.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                <Link href="/hire">
                  <Button
                    size="xl"
                    className="rounded-full bg-white text-primary hover:bg-white/90 shadow-xl"
                  >
                    Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-white/60">
                Free quote within 48 hours. No strings attached.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
