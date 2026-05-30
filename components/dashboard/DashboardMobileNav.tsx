"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  Users,
  // TrendingUp,
  Settings,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Collections", href: "/dashboard/collections", icon: Library },
  { label: "Collectors", href: "/dashboard/collectors", icon: Users },
  // { label: "Insights", href: "/dashboard/insights", icon: TrendingUp },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardMobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") ?? "";
  const hw = (base: string) => (wallet ? `${base}?wallet=${wallet}` : base);

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: "#0e0e0e",
        borderTop: "1px solid #2a2a2a",
        height: 60,
        zIndex: 50,
      }}
    >
      {NAV.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={label}
            href={hw(href)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              textDecoration: "none",
            }}
          >
            <Icon
              size={17}
              strokeWidth={1.5}
              style={{ color: active ? "#F5A623" : "#9f8e7a66" }}
            />
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 8,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: active ? "#F5A623" : "#9f8e7a66",
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
