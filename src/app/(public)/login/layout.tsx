import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your OwnWebify client dashboard to track your project, view quotes, and message your developer.",
  // Account/utility page: no search value, and indexing it competes with the
  // pages we actually want ranking. Kept crawlable (follow) so link equity
  // still flows, but out of the index.
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
