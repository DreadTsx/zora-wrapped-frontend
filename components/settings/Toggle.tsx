"use client";

interface Props {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ enabled, onChange, disabled = false }: Props) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      style={{
        position: "relative",
        width: 48,
        height: 26,
        background: enabled ? "#F5A623" : "#2a2a2a",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.25s ease",
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        padding: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Thumb */}
      <span
        style={{
          position: "absolute",
          top: 3,
          left: enabled ? "calc(100% - 23px)" : 3,
          width: 20,
          height: 20,
          background: enabled ? "#000" : "#9f8e7a",
          transition: "left 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Checkmark when on */}
        {enabled && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#F5A623"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
