import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset the password for your OwnWebify client account.",
  // Account/utility page: no search value, and indexing it competes with the
  // pages we actually want ranking. Kept crawlable (follow) so link equity
  // still flows, but out of the index.
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
