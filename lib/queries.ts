import { useQuery } from "@tanstack/react-query";
import {
  type CreatorStats,
  type VolumePoint,
  type TopBuyer,
  type Collector,
  type Collection,
} from "./zora";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

//! NLP Agent

export async function askAgent(
  query: string,
): Promise<{ result?: string; error?: string }> {
  if (!query.trim()) {
    return { error: "Please enter a query." };
  }

  try {
    const res = await fetch(`${API_BASE}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      return { error: `Server error: ${res.status}` };
    }

    const data = await res.json();

    if (data.error) {
      return { error: data.error };
    }

    return { result: data.result };
  } catch {
    return { error: "Could not reach the agent. Is it running on port 3001?" };
  }
}

//* PRODUCTION fetch ( I need to uncomment when thee API is ready)

async function fetchCreatorStats(wallet: string): Promise<CreatorStats> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}`);
  if (!res.ok) throw new Error("Failed to fetch creator stats");
  return res.json();
}

async function fetchVolumeData(wallet: string): Promise<VolumePoint[]> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}/volume`);
  if (!res.ok) throw new Error("Failed to fetch volume data");
  return res.json();
}

async function fetchTopBuyers(wallet: string): Promise<TopBuyer[]> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}/top-buyers`);
  if (!res.ok) throw new Error("Failed to fetch top buyers");
  return res.json();
}

async function fetchCollectors(wallet: string): Promise<Collector[]> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}/collectors`);
  if (!res.ok) throw new Error("Failed to fetch collectors");
  return res.json();
}

async function fetchCollections(wallet: string): Promise<Collection[]> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}/collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

//*React Query hooks
export function useCreatorStats(wallet: string) {
  return useQuery<CreatorStats>({
    queryKey: ["creator", wallet],
    queryFn: () => fetchCreatorStats(wallet), //!swap to fetchCreatorStats(wallet)
    enabled: !!wallet,
  });
}

export function useVolumeData(wallet: string) {
  return useQuery<VolumePoint[]>({
    queryKey: ["volumeData", wallet],
    queryFn: () => fetchVolumeData(wallet), //!swap to fetchVolumeData(wallet)
    enabled: !!wallet,
  });
}

export function useTopBuyers(wallet: string) {
  return useQuery<TopBuyer[]>({
    queryKey: ["topBuyers", wallet],
    queryFn: () => fetchTopBuyers(wallet),
    enabled: !!wallet,
  });
}

export function useCollectors(wallet: string) {
  return useQuery<Collector[]>({
    queryKey: ["collectors", wallet],
    queryFn: () => fetchCollectors(wallet),
    enabled: !!wallet,
  });
}

export function useCollections(wallet: string) {
  return useQuery<Collection[]>({
    queryKey: ["collections", wallet],
    queryFn: () => fetchCollections(wallet),
    enabled: !!wallet,
  });
}
