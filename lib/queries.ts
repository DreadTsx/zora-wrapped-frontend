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
// Connects to POST /query on the Rust backend.
// Accepts any natural language query containing a wallet address.
// e.g. "How many holders in 0x..." or "Show top 5 buyers of 0x..."

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

//! STATIC fetch (I need to delete these when API is ready)

// async function fetchCreatorStatsStatic(_wallet: string): Promise<CreatorStats> {
//   await new Promise((r) => setTimeout(r, 400)); // simulate network
//   return STATIC_CREATOR;
// }

// async function fetchVolumeDataStatic(_wallet: string): Promise<VolumePoint[]> {
//   await new Promise((r) => setTimeout(r, 600));
//   return STATIC_VOLUME_DATA;
// }

// async function fetchTopBuyersStatic(_wallet: string): Promise<TopBuyer[]> {
//   await new Promise((r) => setTimeout(r, 500));
//   return STATIC_TOP_BUYERS;
// }

// async function fetchCollectorsStatic(_wallet: string): Promise<Collector[]> {
//   await new Promise((r) => setTimeout(r, 500));
//   return STATIC_COLLECTORS;
// }

// async function fetchCollectionsStatic(_wallet: string): Promise<Collection[]> {
//   await new Promise((r) => setTimeout(r, 500));
//   return STATIC_COLLECTIONS;
// }

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
    queryFn: () => fetchTopBuyers(wallet), //!swap to fetchTopBuyers(wallet)
    enabled: !!wallet,
  });
}

export function useCollectors(wallet: string) {
  return useQuery<Collector[]>({
    queryKey: ["collectors", wallet],
    queryFn: () => fetchCollectors(wallet), //!swap to fetchCollectors(wallet)
    enabled: !!wallet,
  });
}

export function useCollections(wallet: string) {
  return useQuery<Collection[]>({
    queryKey: ["collections", wallet],
    queryFn: () => fetchCollections(wallet), //!swap to fetchCollections(wallet)
    enabled: !!wallet,
  });
}
