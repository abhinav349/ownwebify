import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Deliberately *not* nonce-based. Next's nonce flow requires the CSP to be
 * generated per request in `proxy.ts`, which forces every page it covers
 * into dynamic rendering — for a mostly-static marketing site that trades
 * away the prerendering the whole site depends on. A static policy shipped
 * as a header applies to prerendered and dynamic responses alike.
 *
 * The cost of that choice is `'unsafe-inline'` in `script-src`: the GA
 * bootstrap in `app/layout.tsx` and the theme script `next-themes` injects
 * are both inline, and without a nonce there is nothing to whitelist them
 * by. So this policy is not an XSS backstop. What it still buys:
 *   - `object-src` / `base-uri` / `form-action` close off plugin, base-tag
 *     and form-retarget injection, none of which `unsafe-inline` affects;
 *   - host-allowlisted `script-src` means injected markup cannot pull code
 *     from an attacker-controlled origin;
 *   - `connect-src` bounds where a script can exfiltrate to.
 *
 * For real XSS coverage, move GA to `@next/third-parties` and the theme
 * script onto a nonce, then tighten `script-src` to
 * `'self' 'nonce-…' 'strict-dynamic'`.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  // 'unsafe-inline': inline GA bootstrap + next-themes anti-flash script.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  // Tailwind and React inline style attributes.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.blob.vercel-storage.com https://www.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://*.blob.vercel-storage.com",
  // react-three-fiber / postprocessing compile shaders in blob workers.
  "worker-src 'self' blob:",
  "media-src 'self' data: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  // Two years, preload-eligible. Vercel already redirects http->https, but
  // HSTS is what stops the *first* hop of a return visit being downgraded.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // `allow-popups` rather than bare `same-origin` so an OAuth provider
  // opened in a popup can still post back to its opener.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    qualities: [60, 70, 75, 80, 85, 90],
    // Modern codecs; both are widely supported and cut image bytes
    // substantially versus the JPEG/PNG originals.
    formats: ["image/avif", "image/webp"],
    // Optimised variants are content-addressed, so cache them hard.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
      {
        // API responses are per-user by default and must not be stored by a
        // shared cache. `portfolio` and `testimonials` are excluded because
        // they serve public content and set their own `s-maxage`.
        source: "/api/((?!portfolio|testimonials).*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
