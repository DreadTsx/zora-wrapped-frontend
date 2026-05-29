import type { Metadata } from "next";
import { Playfair_Display, Sora, Space_Mono } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zora Wrapped — Your Onchain Story, Told Beautifully",
  description:
    "Paste your Zora wallet address and see your creator analytics. Powered by Aomi.",
  openGraph: {
    title: "Zora Wrapped",
    description: "Your onchain story, told beautifully.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sora.variable} ${spaceMono.variable}`}
    >
      <body className="bg-background text-on-surface font-sora antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
