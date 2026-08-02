import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Logo } from "@/components/ui/logo";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative border-t bg-card overflow-hidden">
      <div className="aurora-bg opacity-30">
        <div className="aurora-layer" />
      </div>
      <div className="noise-overlay" />

      {/* Mini CTA */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="py-14 flex flex-col md:flex-row items-center justify-between gap-6 border-b">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Ready to get started?</h3>
            <p className="text-sm text-muted-foreground mt-1.5">
              Get a free quote for your project in under 48 hours.
            </p>
          </div>
          <Magnetic strength={0.25}>
            <Link
              href="/hire"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full shadow-lg shadow-primary/25")}
            >
              Start a Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={36} />
              <span className="font-bold text-lg tracking-tight">OwnWebify</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Agency-quality web development, honestly priced. From landing pages
              to full-scale web applications — built to convert.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/demos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/hire" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Hire Me
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.instagram.com/ownwebify" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://github.com/abhinav349" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:admin@ownwebify.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  admin@ownwebify.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} OwnWebify. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Crafted with care in Bengaluru, India
          </p>
        </div>
      </div>
    </footer>
  );
}
