import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Project | OwnWebify",
  description: "Submit your web development project request and get a custom quote within 48 hours. No commitment required.",
};

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
