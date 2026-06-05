// lib/zora.ts — Zora Data Layer

/* Types */
export type CreatorStats = {
  wallet: string;
  name: string;
  avatar: string | null;
  totalMints: number;
  volumeETH: number;
  uniqueHolders: number;
  growth30d: number;
};

export type VolumePoint = {
  date: string;
  volume: number;
};

export type TopBuyer = {
  rank: number;
  wallet: string;
  percentage: number;
  amountETH: number;
};

export type Collector = {
  rank: number;
  wallet: string;
  coinsHeld: number;
  firstPurchase: string;
  totalSpentETH: number;
  badge: "WHALE" | "FAN" | "NEW";
};

export type Collection = {
  id: string;
  name: string;
  priceETH: number;
  volumeETH: number;
  holders: number;
  thumbnail: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/*  Static Mock Data*/
// export const STATIC_CREATOR: CreatorStats = {
//   wallet: "0x1234567890abcdef1234567890abcdef12345678",
//   name: "Zora Creator",
//   avatar: null,
//   totalMints: 1200,
//   volumeETH: 45.8,
//   uniqueHolders: 892,
//   growth30d: 12,
// };

// export const STATIC_VOLUME_DATA: VolumePoint[] = [
//   { date: "Jan", volume: 4.2 },
//   { date: "Feb", volume: 7.8 },
//   { date: "Mar", volume: 6.1 },
//   { date: "Apr", volume: 11.4 },
//   { date: "May", volume: 8.9 },
//   { date: "Jun", volume: 15.3 },
// ];

// export const STATIC_TOP_BUYERS: TopBuyer[] = [
//   { rank: 1, wallet: "0x8a...4b29", percentage: 85, amountETH: 12.4 },
//   { rank: 2, wallet: "0x1f...9c0e", percentage: 60, amountETH: 8.1 },
//   { rank: 3, wallet: "0xd4...7a11", percentage: 35, amountETH: 4.5 },
//   { rank: 4, wallet: "0x3b...2f88", percentage: 20, amountETH: 2.8 },
//   { rank: 5, wallet: "0x7e...1d44", percentage: 10, amountETH: 1.2 },
// ];

// export const STATIC_COLLECTORS: Collector[] = [
//   {
//     rank: 1,
//     wallet: "0x8F...3a1B",
//     coinsHeld: 1450,
//     firstPurchase: "Oct 12, 2023",
//     totalSpentETH: 4.2,
//     badge: "WHALE",
//   },
//   {
//     rank: 2,
//     wallet: "0x2C...9e4D",
//     coinsHeld: 980,
//     firstPurchase: "Nov 04, 2023",
//     totalSpentETH: 2.8,
//     badge: "FAN",
//   },
//   {
//     rank: 3,
//     wallet: "0x5A...7c2F",
//     coinsHeld: 750,
//     firstPurchase: "Jan 18, 2024",
//     totalSpentETH: 1.9,
//     badge: "FAN",
//   },
//   {
//     rank: 4,
//     wallet: "0x1E...4b8A",
//     coinsHeld: 120,
//     firstPurchase: "Mar 02, 2024",
//     totalSpentETH: 0.4,
//     badge: "NEW",
//   },
//   {
//     rank: 5,
//     wallet: "0xA9...2d3C",
//     coinsHeld: 88,
//     firstPurchase: "Mar 19, 2024",
//     totalSpentETH: 0.3,
//     badge: "NEW",
//   },
//   {
//     rank: 6,
//     wallet: "0x3F...8e1D",
//     coinsHeld: 640,
//     firstPurchase: "Dec 07, 2023",
//     totalSpentETH: 1.4,
//     badge: "FAN",
//   },
//   {
//     rank: 7,
//     wallet: "0xB2...5f9A",
//     coinsHeld: 310,
//     firstPurchase: "Feb 11, 2024",
//     totalSpentETH: 0.9,
//     badge: "FAN",
//   },
//   {
//     rank: 8,
//     wallet: "0x7D...1c4E",
//     coinsHeld: 45,
//     firstPurchase: "Apr 28, 2024",
//     totalSpentETH: 0.1,
//     badge: "NEW",
//   },
// ];

// export const STATIC_COLLECTIONS: Collection[] = [
//   {
//     id: "1",
//     name: "Aether Series",
//     priceETH: 0.05,
//     volumeETH: 14.2,
//     holders: 1204,
//     thumbnail: null,
//   },
//   {
//     id: "2",
//     name: "Nocturne V1",
//     priceETH: 0.12,
//     volumeETH: 40.8,
//     holders: 882,
//     thumbnail: null,
//   },
//   {
//     id: "3",
//     name: "Fragmented Souls",
//     priceETH: 0.08,
//     volumeETH: 22.1,
//     holders: 2105,
//     thumbnail: null,
//   },
//   {
//     id: "4",
//     name: "Collector Pass",
//     priceETH: 0.2,
//     volumeETH: 4.1,
//     holders: 87,
//     thumbnail: null,
//   },
//   {
//     id: "5",
//     name: "Open Edition III",
//     priceETH: 0.01,
//     volumeETH: 8.9,
//     holders: 3200,
//     thumbnail: null,
//   },
//   {
//     id: "6",
//     name: "Genesis Drop",
//     priceETH: 0.35,
//     volumeETH: 31.4,
//     holders: 540,
//     thumbnail: null,
//   },
// ];

//? REAL API CALLS

export async function getCreatorStats(wallet: string): Promise<CreatorStats> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}`);
  if (!res.ok) throw new Error("Failed to fetch creator stats");
  return res.json();
}

export async function getVolumeData(wallet: string): Promise<VolumePoint[]> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}/volume`);
  if (!res.ok) throw new Error("Failed to fetch volume data");
  return res.json();
}

export async function getTopBuyers(wallet: string): Promise<TopBuyer[]> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}/top-buyers`);
  if (!res.ok) throw new Error("Failed to fetch top buyers");
  return res.json();
}

export async function getCollectors(wallet: string): Promise<Collector[]> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}/collectors`);
  if (!res.ok) throw new Error("Failed to fetch collectors");
  return res.json();
}

export async function getCollections(wallet: string): Promise<Collection[]> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}/collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}
