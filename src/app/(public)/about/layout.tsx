import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | OwnWebify",
  description: "Full-stack web developer with 3+ years of experience building high-performance websites and web applications.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
