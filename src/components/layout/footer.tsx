import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      {/* Mini CTA */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">Ready to get started?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get a free quote for your project in under 48 hours.
            </p>
          </div>
          <Link href="/hire">
            <Button className="rounded-full shadow-md shadow-primary/20">
              Start a Project <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={36} />
              <span className="font-bold text-lg tracking-tight">OwnWebify</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Premium web development for businesses that want to dominate online.
              From landing pages to full-scale applications.
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
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="mailto:hello@ownwebify.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  hello@ownwebify.com
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
