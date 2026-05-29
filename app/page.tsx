import SiteHeader     from "@/components/landing/SiteHeader";
import HeroSection    from "@/components/landing/HeroSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import SiteFooter     from "@/components/landing/SiteFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Mobile-only top bar */}
      <SiteHeader />

      {/* Headline + wallet input */}
      <HeroSection />

      {/* Blurred dashboard teaser */}
      <DashboardPreview />

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}
