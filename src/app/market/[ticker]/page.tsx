import SiteHeader from "@/components/site-header";
import MarketStats from "@/components/market/market-stats";
import MarketAnalytics from "@/components/market/market-analytics";
import OrderbookCard from "@/components/market/orderbook";
import MarketRules from "@/components/market/market-rules";
import ChatPanel from "@/components/market/chat-panel";
import EventMarkets from "@/components/market/event-markets";
import { notFound } from "next/navigation";
import {
  getMarket,
  getMarketCandlesticks,
  getOrderbook,
  getRecentCandlestickWindow,
  getEventMarkets,
} from "@/lib/kalshi";

function formatCloseTime(closeTime: string | null) {
  if (!closeTime) return null;
  const date = new Date(closeTime);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  if (days === 1) return "Closes tomorrow";
  
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  
  return `${days} days · ${formatted}`;
}

export default async function MarketPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.ticker) {
    notFound();
  }
  const ticker = resolvedParams.ticker.toUpperCase();
  const market = await getMarket(ticker);
  const orderbook = await getOrderbook(ticker);
  
  // Fetch related markets from the same event
  const eventMarkets = market.event_ticker 
    ? await getEventMarkets(market.event_ticker)
    : [];
  
  // Determine the best title to display
  const mainTitle = market.event_title && market.event_title !== "Combo"
    ? market.event_title
    : market.display_title;
  
  // Market subtitle showing the specific option
  const marketSubtitle = market.yes_sub_title || market.display_title;
  const showMarketSubtitle = marketSubtitle !== mainTitle && eventMarkets.length > 1;
  
  // Calculate volume display
  const volume = market.volume ?? 0;
  const volumeDisplay = volume >= 1000000 
    ? `$${(volume / 1000000).toFixed(2)}M` 
    : volume >= 1000 
      ? `$${(volume / 1000).toFixed(1)}K`
      : `$${volume}`;

  const { start, end } = getRecentCandlestickWindow(30);
  const candlesticks = market.series_ticker
    ? await getMarketCandlesticks({
        seriesTicker: market.series_ticker,
        ticker,
        startTs: start,
        endTs: end,
        periodInterval: 60,
      })
    : [];

  const context = {
    market,
    orderbook,
    candlesticks,
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
        {/* Header section - matches Kalshi style */}
        <section className="space-y-3">
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 uppercase tracking-wider">
              {market.category ?? "Market"}
            </span>
          </div>
          
          {/* Main title */}
          <h1 className="text-2xl font-semibold text-white sm:text-3xl leading-tight">
            {mainTitle}
          </h1>
          
          {/* Viewing specific outcome */}
          {showMarketSubtitle && (
            <p className="text-base text-emerald-200/80">
              Viewing: {marketSubtitle}
            </p>
          )}
          
          {/* Time info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {market.close_time && (
              <span>{formatCloseTime(market.close_time)}</span>
            )}
            <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded">
              {market.ticker}
            </span>
          </div>
        </section>

        {/* Stats bar */}
        <MarketStats market={market} />

        {/* Main content grid */}
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Left column - Chart and analysis */}
          <div className="space-y-6">
            <MarketAnalytics 
              marketTicker={ticker} 
              candlesticks={candlesticks}
              currentPrice={market.yes_ask ?? market.yes_bid ?? market.last_price ?? undefined}
            />
            
            {/* Volume display */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{volumeDisplay} vol</span>
              <div className="flex gap-2 text-xs">
                <button className="px-2 py-1 rounded bg-black/40 text-muted-foreground hover:text-white">1D</button>
                <button className="px-2 py-1 rounded bg-black/40 text-muted-foreground hover:text-white">1W</button>
                <button className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">1M</button>
                <button className="px-2 py-1 rounded bg-black/40 text-muted-foreground hover:text-white">ALL</button>
              </div>
            </div>
          </div>
          
          {/* Right column - Event markets, chat */}
          <div className="space-y-6">
            {eventMarkets.length > 1 && (
              <EventMarkets
                eventTitle={market.event_title ?? mainTitle}
                markets={eventMarkets}
                currentTicker={ticker}
              />
            )}
            <ChatPanel marketTicker={ticker} context={context} />
          </div>
        </section>

        {/* Bottom section - Rules and orderbook */}
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <MarketRules
            rulesPrimary={market.rules_primary ?? undefined}
            rulesSecondary={market.rules_secondary ?? undefined}
            resolution={market.resolution ?? undefined}
          />
          <OrderbookCard orderbook={orderbook} />
        </section>
      </main>
    </div>
  );
}
