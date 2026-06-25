import { Suspense } from "react";
import type { Metadata } from "next";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  try {
    const params = await searchParams;
    const wallet =
      (Array.isArray(params?.wallet) ? params.wallet[0] : params?.wallet) ||
      "default";

    return {
      title: "Zora Wrapped — Your Onchain Story, Told Beautifully",
      description:
        "Paste your Zora wallet address and see your creator analytics. Powered by Aomi.",
      openGraph: {
        title: "Zora Wrapped",
        description: "Your onchain story, told beautifully.",
        type: "website",
        images: [
          {
            url: `/api/og?wallet=${encodeURIComponent(wallet)}`,
            width: 1200,
            height: 630,
            alt: "Zora Wrapped Dashboard",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
      },
    };
  } catch {
    return {
      title: "Zora Wrapped — Your Onchain Story, Told Beautifully",
      description:
        "Paste your Zora wallet address and see your creator analytics. Powered by Aomi.",
      openGraph: {
        title: "Zora Wrapped",
        description: "Your onchain story, told beautifully.",
        type: "website",
        images: [
          {
            url: "/api/og?wallet=default",
            width: 1200,
            height: 630,
            alt: "Zora Wrapped Dashboard",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
      },
    };
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#131313",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mobile top bar */}
      <div className="mobile-only" style={{ flexDirection: "column" }}>
        <DashboardMobileHeader />
      </div>

      {/* Body row */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Desktop sidebar — Suspense needed because it uses useSearchParams */}
        <div className="desktop-only" style={{ flexShrink: 0 }}>
          <Suspense
            fallback={
              <div
                style={{
                  width: 210,
                  minHeight: "100vh",
                  background: "#0e0e0e",
                  borderRight: "1px solid #2a2a2a",
                }}
              />
            }
          >
            <DashboardSidebar />
          </Suspense>
        </div>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: 72 }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — Suspense needed because it uses useSearchParams */}
      <div className="mobile-only">
        <Suspense
          fallback={
            <nav
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: "#0e0e0e",
                borderTop: "1px solid #2a2a2a",
                zIndex: 50,
              }}
            />
          }
        >
          <DashboardMobileNav />
        </Suspense>
      </div>
    </div>
  );
}
