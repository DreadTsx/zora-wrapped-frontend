"use client";

import { Bell, Share2 } from "lucide-react";

export default function SiteHeader() {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Zora Wrapped",
        text: "Your onchain story, told beautifully.",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    /* Shown only on mobile (< md breakpoint) */
    <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-surface-high">
      {/* Wordmark */}
      <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-on-surface uppercase select-none">
        Zora Wrapped
      </span>

      {/* Icon actions */}
      <div className="flex items-center gap-5">
        <button
          aria-label="Notifications"
          className="text-outline hover:text-primary transition-colors duration-200"
        >
          <Bell size={17} strokeWidth={1.5} />
        </button>
        <button
          aria-label="Share"
          onClick={handleShare}
          className="text-outline hover:text-primary transition-colors duration-200"
        >
          <Share2 size={17} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
