"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

/* Basic Ethereum address check */
const isAddress = (val: string) => /^0x[0-9a-fA-F]{40}$/.test(val.trim());

export default function WalletInput() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = () => {
    const trimmed = value.trim();

    //! TODO: I need to uncomment the real validation when backend is ready
    // if (!isAddress(trimmed)) {
    //   setError(true);
    //   inputRef.current?.focus();
    //   return;
    // }

    // router.push(`/dashboard?wallet=${trimmed}`);

    //! I need to delete these two lines when the backend is ready
    const wallet = trimmed || "0x1234567890abcdef1234567890abcdef12345678";
    router.push(`/dashboard?wallet=${wallet}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const borderColor = error ? "#ff4444" : focused ? "#F5A623" : "#9f8e7a";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input row  */}
      <div
        className="flex items-center pb-3 transition-colors duration-300"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="0x..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          className="
            flex-1 min-w-0
            font-mono text-sm md:text-base
            text-on-surface placeholder:text-outline/40
            bg-transparent border-none outline-none
          "
        />

        <button
          onClick={handleSubmit}
          aria-label="View analytics"
          className="
            flex items-center gap-2 ml-6 shrink-0
            font-mono text-[11px] font-bold tracking-[0.18em] uppercase
            text-on-surface hover:text-primary
            transition-colors duration-200
            group
          "
        >
          View
          <ArrowRight
            size={13}
            strokeWidth={2.5}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </button>
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between mt-2">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200"
          style={{ color: error ? "#ff4444" : "#9f8e7a60" }}
        >
          {error ? "Invalid address —" : "Input valid address"}
          {error && (
            <span className="ml-1 text-error">must be a valid 0x… wallet</span>
          )}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-outline/40">
          Sys.Rdy
        </span>
      </div>
    </div>
  );
}
