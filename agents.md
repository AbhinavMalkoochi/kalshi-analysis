# Kalshi Market Terminal

## Overview
A Next.js prediction market analysis platform for Kalshi markets. Users can browse, search, and chat with AI about market dynamics. **This is an analysis-only platform - no trading functionality.**

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Auth**: Clerk
- **Backend**: Convex (for user settings)
- **AI**: Vercel AI SDK with OpenAI (streaming chat)
- **Charts**: Recharts

## Key Concepts

### Kalshi Hierarchy
```
Series (KXSPACEXCOUNT) → Event (KXSPACEXCOUNT-26FEB) → Markets (KXSPACEXCOUNT-26FEB-10)
```
- **Series**: Recurring topic (e.g., "SpaceX launches")
- **Event**: Specific instance (e.g., "SpaceX launches in Feb 2026")
- **Markets**: Individual betting options (e.g., "Above 10", "Above 12")

### API Integration
- Base URL: `https://api.elections.kalshi.com/trade-api/v2`
- Main file: `src/lib/kalshi.ts`
- Key function: `getMarketOrEvent()` - tries `/markets` first, falls back to `/events`
- No authentication required for public market data

### URL Parsing
- Users paste Kalshi URLs like: `https://kalshi.com/markets/kxspacexcount/spacex-launches/kxspacexcount-26feb`
- Parser in `src/lib/market-url.ts` extracts the event/market ticker from the last path segment

## Project Structure
```
src/
├── app/
│   ├── api/chat/route.ts    # Streaming AI chat endpoint
│   ├── market/[ticker]/     # Market/event detail page
│   └── settings/            # User preferences (API keys)
├── components/
│   ├── event-card.tsx       # Clickable market cards on homepage
│   └── market/
│       ├── chat-panel.tsx   # AI chat with useChat hook
│       ├── event-markets.tsx # Options table
│       └── market-chart.tsx  # Price history chart
├── lib/
│   ├── kalshi.ts            # API client
│   └── market-url.ts        # URL parsing utilities
└── hooks/
    └── use-settings.ts      # User settings hook
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/kalshi.ts` | Kalshi API client, types, normalization |
| `src/app/api/chat/route.ts` | AI chat endpoint with market context |
| `src/components/market/chat-panel.tsx` | Chat UI with streaming |
| `src/app/market/[ticker]/page.tsx` | Market detail page |

## Chat Context
The AI receives context including:
- Market title and category
- All options with current prices
- Market rules (from `rules_primary`, `rules_secondary`)
- Settlement criteria

## BYOK (Bring Your Own Key)
Users store their OpenAI API key in settings. Keys are passed to the chat API route.

## Important Notes for LLMs
1. **No trading** - This platform is for analysis only, never add trading functionality
2. **Prices in cents** - Kalshi prices are 1-99 cents (probabilities)
3. **Event vs Market** - Always check if a ticker is an event or market
4. **Streaming required** - Chat must use streaming via Vercel AI SDK
