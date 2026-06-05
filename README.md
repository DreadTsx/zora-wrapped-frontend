# Zora Wrapped - Creator Dashboard

A modern dashboard for Zora protocol creators to visualize collection performance, analyze top buyers, manage collectors, and get AI-powered insights about their token economics.

## Features

- **Creator Dashboard**: Real-time statistics including total mints, volume, unique holders, and growth metrics
- **Monthly Revenue Chart**: Visualize trading volume trends over time with month-based labels
- **Top Buyers Analysis**: View top collectors ranked by percentage share with wallet address shortening
- **Collectors Management**: Browse detailed collector information including coins held, first purchase dates, and spending
- **Collections Overview**: Track all collections with current pricing, volume, and holder counts
- **Insights AI Chat**: Natural language queries powered by NLP agent (e.g., "Who is my biggest whale?", "What's my total volume?")
- **Data Export**: Download collector and collection data as CSV files
- **Currency Toggle**: Switch between ETH and USD display for all metrics
- **Responsive Design**: Optimized for desktop with clean, modern UI using dark theme

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 + custom CSS variables
- **Charts**: Recharts for data visualization
- **Data Fetching**: SWR for client-side caching and synchronization
- **Backend Integration**: RESTful API with GraphQL support

## Project Structure

```
app/
├── api/
│   └── chat/route.ts           # NLP chat endpoint proxy
├── dashboard/page.tsx           # Main creator dashboard
├── collectors/page.tsx          # Collectors management
├── collections/page.tsx         # Collections overview
├── settings/page.tsx            # Settings and exports
└── layout.tsx                   # Root layout

components/
├── dashboard/                   # Dashboard components
│   ├── DashboardClient.tsx
│   ├── StatCards.tsx
│   ├── VolumeChart.tsx
│   ├── TopBuyersList.tsx
│   ├── ShareCardModal.tsx
│   └── InsightsAIChat.tsx
├── collectors/                  # Collector components
│   ├── CollectorsClient.tsx
│   ├── CollectorsTable.tsx
│   └── CollectorMobileCard.tsx
├── collections/                 # Collection components
│   └── CollectionsClient.tsx
└── settings/                    # Settings components
    └── SettingsClient.tsx

lib/
├── zora.ts                      # Type definitions
├── queries.ts                   # API functions
└── format.ts                    # Formatting utilities

providers/
└── CurrencyProvider.tsx         # ETH/USD toggle context
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running at `https://zora-wrapped-back.onrender.com/`

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Set environment variables (optional, defaults to production backend)
export NEXT_PUBLIC_BACKEND_URL=https://zora-wrapped-back.onrender.com
export NLP_AGENT_URL=https://zora-wrapped-back.onrender.com/query

# Run development server
npm run dev

# Open http://localhost:3000
```

## Environment Variables

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=https://zora-wrapped-back.onrender.com

# NLP agent for chat
NLP_AGENT_URL=https://zora-wrapped-back.onrender.com/query
```

## Key Features

### Data Display
- Wallet addresses shortened: `0x5508...e2d0`
- Numbers formatted with locale awareness: `1.2k`, `3.5M`
- Percentages rounded to 1 decimal: `34.9%`
- Very small values show 4 decimals: `0.0045 ETH`

### Error Handling
- Network errors show user-friendly messages
- Invalid data is sanitized before display
- Chat provides suggestions when queries fail

### Performance
- SWR handles data caching and revalidation
- Recharts optimizes chart rendering
- Lazy loading for collectors and collections

## Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

## API Integration

Connects to backend at `https://zora-wrapped-back.onrender.com/`:

- `GET /api/creator/:wallet` - Creator stats
- `GET /api/creator/:wallet/volume` - Volume data
- `GET /api/creator/:wallet/top-buyers` - Top buyers
- `GET /api/creator/:wallet/collectors` - Collectors
- `GET /api/creator/:wallet/collections` - Collections
- `POST /query` - NLP queries

## License

MIT
