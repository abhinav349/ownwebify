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
