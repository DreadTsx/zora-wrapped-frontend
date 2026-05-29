import { Suspense } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

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
