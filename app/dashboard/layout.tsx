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

      {/* Body row: sidebar + content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Desktop sideber */}
        <div className="desktop-only" style={{ flexShrink: 0 }}>
          <DashboardSidebar />
        </div>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: 72 }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="mobile-only">
        <DashboardMobileNav />
      </div>
    </div>
  );
}
