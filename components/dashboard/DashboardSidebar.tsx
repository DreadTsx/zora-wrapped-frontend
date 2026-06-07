"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Library, Users, Settings } from "lucide-react";
import { useCreatorStats } from "@/lib/queries";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Collections", href: "/dashboard/collections", icon: Library },
  { label: "Collectors", href: "/dashboard/collectors", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") ?? "";
  const hw = (base: string) => (wallet ? `${base}?wallet=${wallet}` : base);

  const { data: stats } = useCreatorStats(wallet);

  const short = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : "0x1234...5678";

  const displayName = stats?.name || "Zora Creator";
  const avatarUrl = stats?.avatar ?? null;

  // Initials for the fallback avatar box
  const initials =
    displayName
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("") || "ZC";

  return (
    <aside
      style={{
        width: "210px",
        minHeight: "100vh",
        background: "#0e0e0e",
        borderRight: "1px solid #2a2a2a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "32px 24px 24px",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 44,
            height: 44,
            background: "#1c1b1b",
            border: "1px solid #2a2a2a",
            marginBottom: 16,
            overflow: "hidden",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              sizes="44px"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 11,
                  color: "#9f8e7a",
                }}
              >
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <div
          style={{
            fontFamily: "var(--f-serif)",
            fontWeight: 700,
            fontSize: 18,
            color: "#e5e2e1",
            lineHeight: 1.2,
            marginBottom: 6,
            wordBreak: "break-word",
          }}
        >
          {displayName}
        </div>

        {/* Short wallet */}
        <div
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            color: "#9f8e7a55",
            letterSpacing: "0.06em",
          }}
        >
          {short}
        </div>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                paddingLeft: active ? 10 : 12,
                background: active ? "#1c1b1b" : "transparent",
                borderLeft: active
                  ? "2px solid #F5A623"
                  : "2px solid transparent",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              <Icon
                size={15}
                strokeWidth={1.6}
                style={{ color: active ? "#F5A623" : "#9f8e7a", flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "var(--f-sans)",
                  fontSize: 14,
                  color: active ? "#e5e2e1" : "#9f8e7a",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "16px 24px", borderTop: "1px solid #2a2a2a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              background: "#F5A623",
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              color: "#9f8e7a55",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Connected
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            color: "#9f8e7a88",
            marginTop: 4,
            letterSpacing: "0.04em",
          }}
        >
          {short}
        </div>
      </div>
    </aside>
  );
}
