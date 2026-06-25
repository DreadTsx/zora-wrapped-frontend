'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply theme on mount (after hydration)
    try {
      const stored = localStorage.getItem('zw-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.theme === 'LIGHT') {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    } catch {}
  }, []);

  return <>{children}</>;
}
