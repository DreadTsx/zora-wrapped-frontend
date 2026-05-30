interface Props {
  label: string;
  children: React.ReactNode;
}

export default function SettingsSection({ label, children }: Props) {
  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #2a2a2a",
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#F5A623",
          }}
        >
          {label}
        </span>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
