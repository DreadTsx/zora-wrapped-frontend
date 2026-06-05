// lib/zora.ts — Zora Data Layer

/* Types */
export type CreatorStats = {
  wallet: string;
  name: string;
  avatar: string | null;
  total_mints: number;
  volume_eth: number;
  unique_holders: number;
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
  amount_eth: number;
};

export type Collector = {
  rank: number;
  wallet: string;
  coins_held: number;
  first_purchase: string;
  total_spent_eth: number;
  badge: "WHALE" | "FAN" | "NEW";
};

export type Collection = {
  id: string;
  name: string;
  price_eth: number;
  volume_eth: number;
  holders: number;
  thumbnail: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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
