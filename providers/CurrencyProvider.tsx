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

      // Handle invalid numbers (NaN, Infinity)
      if (!isFinite(ethAmount)) {
        return "0.00 ETH";
      }

      // For very small values, show more decimal places to avoid "0.00"
      let displayDecimals = decimals;
      if (Math.abs(ethAmount) > 0 && Math.abs(ethAmount) < 0.01) {
        displayDecimals = 4;
      }

      // For very large numbers (likely scientific notation from API), normalize them
      // Check if number is extremely large (typical of scientific notation errors)
      if (Math.abs(ethAmount) > 1e10) {
        // Likely a data error - reset to 0
        return "0.00 ETH";
      }

      if (currency === "USD") {
        const usd = ethAmount * ethPrice;
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: displayDecimals,
          maximumFractionDigits: displayDecimals,
        }).format(usd);
      }
      return `${ethAmount.toFixed(displayDecimals)} ETH`;
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
