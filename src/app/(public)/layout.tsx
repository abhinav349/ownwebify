import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/demos/providers/smooth-scroll-provider";
import { DemoCursor } from "@/components/demos/shared/cursor";
import { LoadingScreen } from "@/components/shared/loading-screen";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <LoadingScreen />
      <DemoCursor accent="var(--primary)" />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  );
}
