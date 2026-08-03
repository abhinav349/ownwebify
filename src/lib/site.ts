/**
 * Canonical public origin, used for sitemap/robots/structured data.
 *
 * Deliberately NOT `NEXTAUTH_URL`: that's an auth-deployment concern and on
 * preview deployments it points at the preview host, which would publish a
 * sitemap full of preview URLs and a robots.txt referencing the wrong
 * sitemap. Override only via NEXT_PUBLIC_SITE_URL when the real public
 * origin genuinely differs.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ownwebify.com"
).replace(/\/$/, "");

/**
 * Primary navigation, shared by the main site header and the /demos gallery
 * header.
 *
 * Shared rather than duplicated because the two headers look nothing alike —
 * one is the themed site chrome, the other is dark and typeset for the demo
 * gallery — and a second hand-maintained copy of this list is how /demos ended
 * up with no navigation at all while every other page had it.
 */
export const SITE_NAV = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/demos" },
  { name: "About", href: "/about" },
] as const;
