"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type Currency = "ETH" | "USD";

interface CurrencyContextValue {
  currency: Currency;
  ethPrice: number;
  setCurrency: (c: Currency) => void;
  format: (ethAmount: number, decimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "ETH",
  ethPrice: 3200,
  setCurrency: () => {},
  format: (v) => `${v} ETH`,
});

const FALLBACK_PRICE = 3200; // fallback if fetch fails

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const s = localStorage.getItem("zw-settings");
      if (s) return (JSON.parse(s).currency as Currency) ?? "ETH";
    } catch {}
    return "ETH";
  });

  const [ethPrice, setEthPrice] = useState(FALLBACK_PRICE);

  // Fetch live ETH price from CoinGecko
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    )
      .then((r) => r.json())
      .then((d) => {
        const price = d?.ethereum?.usd;
        if (typeof price === "number" && price > 0) setEthPrice(price);
      })
      .catch(() => {}); // silently fallback
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    // Persist to localStorage and merge with existing settings
    try {
      const existing = JSON.parse(localStorage.getItem("zw-settings") ?? "{}");
      localStorage.setItem(
        "zw-settings",
        JSON.stringify({ ...existing, currency: c }),
      );
    } catch {}
  }, []);

  // format(ethAmount) → "1.2 ETH" or "$3,840.00"
  const format = useCallback(
    (ethAmount: number | undefined | null, decimals = 2): string => {
      // Handle undefined or null values
      if (ethAmount === undefined || ethAmount === null || typeof ethAmount !== "number") {
        return "0.00 ETH";
      }

      if (currency === "USD") {
        const usd = ethAmount * ethPrice;
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(usd);
      }
      return `${ethAmount.toFixed(decimals)} ETH`;
    },
    [currency, ethPrice],
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, ethPrice, setCurrency, format }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
