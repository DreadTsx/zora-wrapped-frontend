"use client";

import { useEffect, useState } from "react";
import WalletInput from "./WalletInput";

/* Stagger helper */
function AnimateIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(22px)",
        transition:
          "opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="
      relative flex flex-col items-center justify-center text-center
      px-5 md:px-16
      pt-20 md:pt-36
      pb-16 md:pb-24
      overflow-hidden
    "
    >
      {/* Ambient amber glow behind headline (somewhat like a background)*/}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "700px",
          height: "340px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.09) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Headline  */}
      <AnimateIn delay={80}>
        <h1
          className="font-playfair font-bold text-on-surface leading-[1.08] text-balance"
          style={{
            fontSize: "clamp(42px, 8.5vw, 76px)",
            letterSpacing: "-0.025em",
            maxWidth: "820px",
          }}
        >
          Your onchain story,
          <br className="hidden sm:block" /> told beautifully
        </h1>
      </AnimateIn>

      {/* Subtitle */}
      <AnimateIn delay={220} className="mt-5 md:mt-6">
        <p className="font-sora text-on-variant text-base md:text-lg max-w-sm md:max-w-md leading-relaxed">
          Paste your Zora wallet. See your creator analytics.
        </p>
      </AnimateIn>

      {/*Wallet Input*/}
      <AnimateIn delay={380} className="w-full max-w-2xl mt-10 md:mt-14">
        <WalletInput />
      </AnimateIn>

      {/* Powered-by badge */}
      <AnimateIn delay={520} className="mt-8">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-outline/50">
            Powered by Aomi — Base Network
          </span>
          <div className="w-1 h-1 bg-primary" />
        </div>
      </AnimateIn>
    </section>
  );
}
