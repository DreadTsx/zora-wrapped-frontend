"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, LogOut, Download, Users } from "lucide-react";
import Toggle from "./Toggle";
import SettingsSection from "./SettingsSection";
import { useCurrency } from "@/providers/CurrencyProvider";
import { getCollections, getCollectors } from "@/lib/zora";

//Types
type Currency = "ETH" | "USD";

interface NotifState {
  newHolder: boolean;
  priceMovement: boolean;
  weeklySummary: boolean;
  whaleActivity: boolean;
}

const DEFAULT_NOTIFS: NotifState = {
  newHolder: true,
  priceMovement: false,
  weeklySummary: true,
  whaleActivity: false,
};

// CSV helpers
function downloadCSV(filename: string, rows: string[][], headers: string[]) {
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportAnalytics(wallet: string) {
  const headers = ["Collection", "Price (ETH)", "Volume (ETH)", "Holders"];
  const data = await getCollections(wallet);
  const rows = data.map((c) => [
    c.name,
    String(c.priceETH),
    String(c.volumeETH),
    String(c.holders),
  ]);
  downloadCSV("zora-wrapped-analytics.csv", rows, headers);
}

async function exportCollectors(wallet: string) {
  const headers = [
    "Rank",
    "Wallet",
    "Coins Held",
    "First Purchase",
    "Total Spent (ETH)",
    "Badge",
  ];
  const data = await getCollectors(wallet);
  const rows = data.map((c) => [
    String(c.rank),
    c.wallet,
    String(c.coinsHeld),
    c.firstPurchase,
    String(c.totalSpentETH),
    c.badge,
  ]);
  downloadCSV("zora-wrapped-collectors.csv", rows, headers);
}

//Shared row layout
function SettingRow({
  title,
  desc,
  right,
  last = false,
}: {
  title: string;
  desc: string;
  right: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        padding: "20px 24px",
        borderBottom: last ? "none" : "1px solid #2a2a2a",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--f-sans)",
            fontSize: 15,
            fontWeight: 500,
            color: "#e5e2e1",
            marginBottom: 4,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            color: "#9f8e7a66",
            letterSpacing: "0.04em",
            lineHeight: 1.5,
          }}
        >
          {desc}
        </p>
      </div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
}

// Toggle for ETH/USD and Dark/Light
function PillGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string; locked?: boolean }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex" }}>
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => !opt.locked && onChange(opt.value)}
            disabled={opt.locked}
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "8px 18px",
              background: active ? "#F5A623" : "#1c1b1b",
              color: active ? "#000" : opt.locked ? "#9f8e7a33" : "#9f8e7a",
              border: "1px solid #2a2a2a",
              borderLeft: i > 0 ? "none" : "1px solid #2a2a2a",
              cursor: opt.locked ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// Main component
export default function SettingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") ?? "";
  const short = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : "0x1234...5678";
  const { setCurrency: setGlobalCurrency } = useCurrency();

  // Lazy initialisers they read localStorage once on first render and no useEffect needed
  const [notifs, setNotifs] = useState<NotifState>(() => {
    try {
      const stored = localStorage.getItem("zw-settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.notifs) return parsed.notifs;
      }
    } catch {}
    return DEFAULT_NOTIFS;
  });

  const [currency, setCurrencyLocal] = useState<Currency>(() => {
    try {
      const stored = localStorage.getItem("zw-settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.currency) return parsed.currency as Currency;
      }
    } catch {}
    return "ETH";
  });

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toggleToast, setToggleToast] = useState<{
    label: string;
    on: boolean;
  } | null>(null);
  const [currencyToast, setCurrencyToast] = useState<string | null>(null);

  const handleSave = () => {
    try {
      localStorage.setItem("zw-settings", JSON.stringify({ notifs, currency }));
      setGlobalCurrency(currency);
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDisconnect = () => {
    localStorage.removeItem("zw-settings");
    router.push("/");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const NOTIF_LABELS: Record<keyof NotifState, string> = {
    newHolder: "New Holder Alert",
    priceMovement: "Price Movement",
    weeklySummary: "Weekly Summary",
    whaleActivity: "Whale Activity",
  };

  const handleCurrencyChange = (c: string) => {
    const next = c as Currency;
    setCurrencyLocal(next);
    setGlobalCurrency(next);
    setCurrencyToast(next === "USD" ? "Switched to USD" : "Switched to ETH");
    setTimeout(() => setCurrencyToast(null), 1800);
  };

  const setNotif = (key: keyof NotifState) => (val: boolean) => {
    setNotifs((prev) => ({ ...prev, [key]: val }));
    setToggleToast({ label: NOTIF_LABELS[key], on: val });
    setTimeout(() => setToggleToast(null), 1800);
  };

  return (
    <div
      className="dash-pad"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Copy toast notification */}
      <div
        style={{
          position: "fixed",
          bottom: 80,
          left: "50%",
          transform: `translateX(-50%) translateY(${copied ? "0px" : "12px"})`,
          opacity: copied ? 1 : 0,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          background: "#141414",
          border: "1px solid #F5A623",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 999,
          pointerEvents: "none",
        }}
      >
        <div
          style={{ width: 6, height: 6, background: "#F5A623", flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#F5A623",
            whiteSpace: "nowrap",
          }}
        >
          Address copied
        </span>
      </div>

      {/*Currency toast notification */}
      <div
        style={{
          position: "fixed",
          bottom: 120,
          left: "50%",
          transform: `translateX(-50%) translateY(${currencyToast ? "0px" : "12px"})`,
          opacity: currencyToast ? 1 : 0,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          background: "#141414",
          border: "1px solid #F5A623",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 997,
          pointerEvents: "none",
        }}
      >
        <div
          style={{ width: 6, height: 6, flexShrink: 0, background: "#F5A623" }}
        />
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#F5A623",
            whiteSpace: "nowrap",
          }}
        >
          {currencyToast}
        </span>
      </div>

      {/* Toggle toast notification */}
      <div
        style={{
          position: "fixed",
          bottom: 80,
          left: "50%",
          transform: `translateX(-50%) translateY(${toggleToast ? "0px" : "12px"})`,
          opacity: toggleToast ? 1 : 0,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          background: "#141414",
          border: `1px solid ${toggleToast?.on ? "#22c55e" : "#ff4444"}`,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 998,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            flexShrink: 0,
            background: toggleToast?.on ? "#22c55e" : "#ff4444",
          }}
        />
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: toggleToast?.on ? "#22c55e" : "#ff4444",
            whiteSpace: "nowrap",
          }}
        >
          {toggleToast?.label} {toggleToast?.on ? "Activated" : "Deactivated"}
        </span>
      </div>

      {/* Page heading  */}
      <div style={{ paddingBottom: 8, borderBottom: "1px solid #2a2a2a" }}>
        <h1
          style={{
            fontFamily: "var(--f-serif)",
            fontWeight: 700,
            fontSize: "clamp(28px,4vw,42px)",
            color: "#e5e2e1",
            lineHeight: 1.1,
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            color: "#9f8e7a55",
            marginTop: 6,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Manage your Zora Wrapped experience.
        </p>
      </div>

      {/* Max width container for sections */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 640,
        }}
      >
        {/* WALLET */}
        <SettingsSection label="Wallet">
          <div style={{ padding: "20px 24px" }}>
            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#9f8e7a66",
                marginBottom: 10,
              }}
            >
              Connected Address
            </p>

            {/* Wallet box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#1c1b1b",
                border: "1px solid #2a2a2a",
                padding: "12px 16px",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    background: "#F5A623",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#F5A623",
                    letterSpacing: "0.06em",
                  }}
                >
                  {short}
                </span>
              </div>
              <button
                onClick={handleCopy}
                title="Copy full address"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: copied ? "#F5A623" : "#9f8e7a55",
                  display: "flex",
                  transition: "color 0.15s",
                }}
              >
                <Copy size={14} strokeWidth={1.5} />
              </button>
            </div>

            {/* Disconnect button */}
            <button
              onClick={handleDisconnect}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "11px 0",
                fontFamily: "var(--f-mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: "transparent",
                color: "#e5e2e1",
                border: "1px solid #e5e2e155",
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ff4444";
                e.currentTarget.style.color = "#ff4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e2e155";
                e.currentTarget.style.color = "#e5e2e1";
              }}
            >
              <LogOut size={13} strokeWidth={2} />
              Disconnect
            </button>
          </div>
        </SettingsSection>

        {/* NOTIFICATIONS  */}
        <SettingsSection label="Notifications(Unavailable for now)">
          {[
            {
              key: "newHolder" as const,
              title: "New Holder Alert",
              desc: "Get notified when a new unique wallet mints.",
            },
            {
              key: "priceMovement" as const,
              title: "Price Movement >10%",
              desc: "Alerts for significant floor price changes.",
            },
            {
              key: "weeklySummary" as const,
              title: "Weekly Summary Email",
              desc: "Digest of your collection's performance.",
            },
            {
              key: "whaleActivity" as const,
              title: "Whale Activity Alert",
              desc: "Notifications for large volume transactions.",
              last: true,
            },
          ].map(({ key, title, desc, last }) => (
            <SettingRow
              key={key}
              title={title}
              desc={desc}
              last={last}
              right={
                <Toggle
                  enabled={notifs[key]}
                  onChange={setNotif(key)}
                  disabled
                  // disabled for now till this feature is complete
                />
              }
            />
          ))}
        </SettingsSection>

        {/* DISPLAY  */}
        <SettingsSection label="Display">
          <SettingRow
            title="Preferred Currency"
            desc="Display values across the dashboard."
            right={
              <PillGroup
                value={currency}
                onChange={handleCurrencyChange}
                options={[
                  { label: "ETH", value: "ETH" },
                  { label: "USD", value: "USD" },
                ]}
              />
            }
          />
          <SettingRow
            title="Theme"
            desc="Interface color palette."
            last
            right={
              <PillGroup
                value="DARK"
                onChange={() => {}}
                options={[
                  { label: "Dark", value: "DARK" },
                  { label: "Light (Locked)", value: "LIGHT", locked: true },
                ]}
              />
            }
          />
        </SettingsSection>

        {/* DATA EXPORT  */}
        <SettingsSection label="Data Export">
          <SettingRow
            title="Download your full analytics data as CSV"
            desc="Includes all historical mints and transfers."
            right={
              <button
                onClick={() => exportAnalytics(wallet)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "9px 16px",
                  background: "transparent",
                  color: "#e5e2e1",
                  border: "1px solid #2a2a2a",
                  cursor: "pointer",
                  transition: "border-color 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#F5A623";
                  e.currentTarget.style.color = "#F5A623";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.color = "#e5e2e1";
                }}
              >
                <Download size={13} strokeWidth={2} />
                Export
              </button>
            }
          />
          <SettingRow
            title="Export Collector List"
            desc="Current unique holders snapshot."
            last
            right={
              <button
                onClick={() => exportCollectors(wallet)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "9px 16px",
                  background: "transparent",
                  color: "#e5e2e1",
                  border: "1px solid #2a2a2a",
                  cursor: "pointer",
                  transition: "border-color 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#F5A623";
                  e.currentTarget.style.color = "#F5A623";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.color = "#e5e2e1";
                }}
              >
                <Users size={13} strokeWidth={2} />
                Export
              </button>
            }
          />
        </SettingsSection>

        {/* SAVE CHANGES */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingBottom: 40,
          }}
        >
          <button
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: "transparent",
              border: "none",
              color: saved ? "#F5A623" : "#e5e2e1",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
          >
            {saved ? "Saved ✓" : "Save Changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}
