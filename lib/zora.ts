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

export type HolderPoint = {
  date: string;
  holders: number;
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

/!* Static Mock Data*/;
export const STATIC_CREATOR: CreatorStats = {
  wallet: "0x1234567890abcdef1234567890abcdef12345678",
  name: "Zora Creator",
  avatar: null,
  totalMints: 1200,
  volumeETH: 45.8,
  uniqueHolders: 892,
  growth30d: 12,
};

export const STATIC_HOLDER_GROWTH: HolderPoint[] = [
  { date: "Jan", holders: 120 },
  { date: "Feb", holders: 280 },
  { date: "Mar", holders: 410 },
  { date: "Apr", holders: 520 },
  { date: "May", holders: 680 },
  { date: "Jun", holders: 892 },
];

export const STATIC_TOP_BUYERS: TopBuyer[] = [
  { rank: 1, wallet: "0x8a...4b29", percentage: 85, amountETH: 12.4 },
  { rank: 2, wallet: "0x1f...9c0e", percentage: 60, amountETH: 8.1 },
  { rank: 3, wallet: "0xd4...7a11", percentage: 35, amountETH: 4.5 },
  { rank: 4, wallet: "0x3b...2f88", percentage: 20, amountETH: 2.8 },
  { rank: 5, wallet: "0x7e...1d44", percentage: 10, amountETH: 1.2 },
];

export const STATIC_COLLECTORS: Collector[] = [
  {
    rank: 1,
    wallet: "0x8a...4b29",
    coinsHeld: 5,
    firstPurchase: "Jan 12, 2024",
    totalSpentETH: 12.4,
    badge: "WHALE",
  },
  {
    rank: 2,
    wallet: "0x1f...9c0e",
    coinsHeld: 4,
    firstPurchase: "Feb 3, 2024",
    totalSpentETH: 8.1,
    badge: "WHALE",
  },
  {
    rank: 3,
    wallet: "0xd4...7a11",
    coinsHeld: 3,
    firstPurchase: "Feb 28, 2024",
    totalSpentETH: 4.5,
    badge: "FAN",
  },
  {
    rank: 4,
    wallet: "0x3b...2f88",
    coinsHeld: 2,
    firstPurchase: "Mar 14, 2024",
    totalSpentETH: 2.8,
    badge: "FAN",
  },
  {
    rank: 5,
    wallet: "0x7e...1d44",
    coinsHeld: 1,
    firstPurchase: "Apr 2, 2024",
    totalSpentETH: 1.2,
    badge: "FAN",
  },
  {
    rank: 6,
    wallet: "0xc9...33f1",
    coinsHeld: 1,
    firstPurchase: "May 10, 2024",
    totalSpentETH: 0.8,
    badge: "NEW",
  },
  {
    rank: 7,
    wallet: "0xa2...8b20",
    coinsHeld: 1,
    firstPurchase: "May 18, 2024",
    totalSpentETH: 0.5,
    badge: "NEW",
  },
  {
    rank: 8,
    wallet: "0xf0...91de",
    coinsHeld: 1,
    firstPurchase: "Jun 1, 2024",
    totalSpentETH: 0.3,
    badge: "NEW",
  },
];

export const STATIC_COLLECTIONS: Collection[] = [
  {
    id: "1",
    name: "Aether Series",
    priceETH: 0.05,
    volumeETH: 14.2,
    holders: 1204,
    thumbnail: null,
  },
  {
    id: "2",
    name: "Nocturne V1",
    priceETH: 0.12,
    volumeETH: 40.8,
    holders: 882,
    thumbnail: null,
  },
  {
    id: "3",
    name: "Fragmented Souls",
    priceETH: 0.08,
    volumeETH: 22.1,
    holders: 2105,
    thumbnail: null,
  },
  {
    id: "4",
    name: "Collector Pass",
    priceETH: 0.2,
    volumeETH: 4.1,
    holders: 87,
    thumbnail: null,
  },
  {
    id: "5",
    name: "Open Edition III",
    priceETH: 0.01,
    volumeETH: 8.9,
    holders: 3200,
    thumbnail: null,
  },
  {
    id: "6",
    name: "Genesis Drop",
    priceETH: 0.35,
    volumeETH: 31.4,
    holders: 540,
    thumbnail: null,
  },
];
// REAL API CALLS —

// import { createPublicClient, http } from "viem";
// import { base } from "viem/chains";

// const ZORA_GRAPHQL = "https://api.zora.co/graphql";

// const publicClient = createPublicClient({
//   chain: base,
//   transport: http(),
// });

// export async function getCreatorStats(wallet: string): Promise<CreatorStats> {
//   const res = await fetch(ZORA_GRAPHQL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       query: `
//         query CreatorStats($wallet: String!) {
//           aggregateStat {
//             nftCount(where: { creatorAddresses: [$wallet] })
//             ownerCount(where: { creatorAddresses: [$wallet] })
//             salesVolume(where: { creatorAddresses: [$wallet] }) {
//               totalSalesVolumeETH
//             }
//           }
//         }
//       `,
//       variables: { wallet },
//     }),
//   });
//   const data = await res.json();
//   // Transform response into CreatorStats shape
//   return {
//     wallet,
//     name:          "Zora Creator",
//     avatar:        null,
//     totalMints:    data.data.aggregateStat.nftCount,
//     volumeETH:     data.data.aggregateStat.salesVolume.totalSalesVolumeETH,
//     uniqueHolders: data.data.aggregateStat.ownerCount,
//     growth30d:     0, // compute separately from time-series data
//   };
// }

// export async function getHolderGrowth(wallet: string): Promise<HolderPoint[]> {
//   // Fetch time-series holder data from Zora API
//   const res = await fetch(`https://api.zora.co/collections?creatorAddress=${wallet}`);
//   const data = await res.json();
//   // Transform into HolderPoint[] …
//   return data;
// }

// export async function getTopBuyers(wallet: string): Promise<TopBuyer[]> {
//   const res = await fetch(ZORA_GRAPHQL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       query: `
//         query TopBuyers($wallet: String!) {
//           sales(
//             where: { sellerAddress: $wallet }
//             sort: { sortKey: ETH_PRICE, sortDirection: DESC }
//             pagination: { limit: 10 }
//           ) {
//             nodes {
//               buyerAddress
//               priceInfo { priceDecimal }
//             }
//           }
//         }
//       `,
//       variables: { wallet },
//     }),
//   });
//   const data = await res.json();
//   // Transform into TopBuyer[] …
//   return data;
// }

// export async function getCollections(wallet: string): Promise<Collection[]> {
//   const res = await fetch(ZORA_GRAPHQL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       query: `
//         query Collections($wallet: String!) {
//           tokens(
//             where: { creatorAddresses: [$wallet] }
//             sort: { sortKey: ETH_SALE_PRICE, sortDirection: DESC }
//           ) {
//             nodes {
//               tokenId
//               name
//               image { url }
//               markets { floorAsk { price { decimal } } }
//             }
//           }
//         }
//       `,
//       variables: { wallet },
//     }),
//   });
//   const data = await res.json();
//   // Transform into Collection[] …
//   return data;
// }
