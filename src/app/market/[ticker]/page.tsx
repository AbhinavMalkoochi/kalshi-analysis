import SiteHeader from "@/components/site-header";
import MarketAnalytics from "@/components/market/market-analytics";
import OrderbookCard from "@/components/market/orderbook";
import MarketRules from "@/components/market/market-rules";
import ChatPanel from "@/components/market/chat-panel";
import EventMarkets from "@/components/market/event-markets";
import { notFound } from "next/navigation";
import {
  getMarketOrEvent,
  getMarketCandlesticks,
  getOrderbook,
  getRecentCandlestickWindow,
  type Market,
  type Event,
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

function formatVolume(volume: number) {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(2)}M`;
  } else if (volume >= 1000) {
    return `$${Math.round(volume / 1000)}K`;
  }
  return `$${volume.toLocaleString()}`;
}

// Stats bar component - standardized for both market and event views
function StatsBar({ volume, markets }: { volume: number; markets?: number }) {
  return (
    <section className="flex items-center gap-6 border-b border-border/20 pb-4 text-sm">
      <div>
        <span className="text-muted-foreground">Volume </span>
        <span className="font-mono text-foreground">{formatVolume(volume)}</span>
      </div>
      {markets !== undefined && markets > 1 && (
        <div>
          <span className="text-muted-foreground">Options </span>
          <span className="font-mono text-foreground">{markets}</span>
        </div>
      )}
    </section>
  );
}

// Build chat context from markets
function buildChatContext(params: {
  ticker: string;
  title: string;
  eventTitle?: string;
  category?: string;
  rules?: string;
  markets: Market[];
}) {
  return {
    marketTicker: params.ticker,
    marketTitle: params.title,
    eventTitle: params.eventTitle,
    category: params.category,
    rules: params.rules,
    markets: params.markets.map((m) => ({
      name: m.yes_sub_title || m.display_title,
      chance: m.quote.chance,
      yes_ask: m.quote.yes_ask,
      no_ask: m.quote.no_ask,
    })),
  };
}

// Render for an event (shows all markets in the event)
async function EventView({
  event,
  candlesticks,
}: {
  event: Event;
  candlesticks: Awaited<ReturnType<typeof getMarketCandlesticks>>;
}) {
  // Calculate total volume across all markets
  const totalVolume = event.markets.reduce(
    (sum, m) => sum + (m.volume ?? 0),
    0
  );

  // Get the lead market (highest volume or first)
  const leadMarket = event.markets.reduce((best, m) =>
    (m.volume ?? 0) > (best.volume ?? 0) ? m : best,
    event.markets[0]
  );

  // Calculate "forecast" - lead market's chance
  const forecast = leadMarket?.quote.chance ?? null;

  // Build rules string from lead market
  const rules = [
    leadMarket?.rules_primary,
    leadMarket?.rules_secondary,
  ].filter(Boolean).join("\n\n");

  const chatContext = buildChatContext({
    ticker: event.event_ticker,
    title: event.title,
    eventTitle: event.title,
    category: event.category ?? undefined,
    rules,
    markets: event.markets,
  });

  return (
    <>
      {/* Header section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 uppercase tracking-wider">
            {event.category ?? "Event"}
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-white sm:text-3xl leading-tight">
          {event.title}
        </h1>

        {forecast !== null && (
          <div className="text-sm text-muted-foreground">
            Forecast <span className="font-mono text-emerald-300">{Math.round(forecast)}%</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {leadMarket?.close_time && (
            <span>{formatCloseTime(leadMarket.close_time)}</span>
          )}
          <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded">
            {event.event_ticker}
          </span>
        </div>
      </section>

      <StatsBar volume={totalVolume} markets={event.markets.length} />

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Chart using lead market */}
          {leadMarket && (
            <MarketAnalytics
              marketTicker={leadMarket.ticker}
              candlesticks={candlesticks}
              currentPrice={leadMarket.quote.mark_price ?? leadMarket.quote.last_trade_price ?? undefined}
            />
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formatVolume(totalVolume)} vol</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* All markets in this event */}
          <EventMarkets
            eventTitle={event.title}
            markets={event.markets}
          />
          <ChatPanel context={chatContext} />
        </div>
      </section>

      {/* Rules from lead market */}
      {leadMarket && (leadMarket.rules_primary || leadMarket.rules_secondary) && (
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <MarketRules
            rulesPrimary={leadMarket.rules_primary ?? undefined}
            rulesSecondary={leadMarket.rules_secondary ?? undefined}
            resolution={leadMarket.resolution ?? undefined}
          />
          <OrderbookCard orderbook={{ yes: [], no: [] }} />
        </section>
      )}
    </>
  );
}

// Render for a single market (direct market ticker)
async function MarketView({
  market,
  eventMarkets,
  candlesticks,
  orderbook,
}: {
  market: Market;
  eventMarkets: Market[];
  candlesticks: Awaited<ReturnType<typeof getMarketCandlesticks>>;
  orderbook: Awaited<ReturnType<typeof getOrderbook>>;
}) {
  const mainTitle = market.event_title && market.event_title !== "Combo"
    ? market.event_title
    : market.display_title;

  const volume = market.volume ?? 0;
  const chance = market.quote.chance !== null ? `${market.quote.chance}%` : "—";

  // Build rules string
  const rules = [
    market.rules_primary,
    market.rules_secondary,
  ].filter(Boolean).join("\n\n");

  // Use event markets if available, otherwise just this market
  const marketsForContext = eventMarkets.length > 0 ? eventMarkets : [market];

  const chatContext = buildChatContext({
    ticker: market.ticker,
    title: mainTitle,
    eventTitle: market.event_title ?? undefined,
    category: market.category ?? undefined,
    rules,
    markets: marketsForContext,
  });

  return (
    <>
      {/* Header section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 uppercase tracking-wider">
            {market.category ?? "Market"}
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-white sm:text-3xl leading-tight">
          {mainTitle}
        </h1>

        <div className="text-sm text-muted-foreground">
          Chance <span className="font-mono text-emerald-300">{chance}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {market.close_time && (
            <span>{formatCloseTime(market.close_time)}</span>
          )}
          <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded">
            {market.ticker}
          </span>
        </div>
      </section>

      <StatsBar volume={volume} markets={eventMarkets.length} />

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <MarketAnalytics
            marketTicker={market.ticker}
            candlesticks={candlesticks}
            currentPrice={market.quote.mark_price ?? market.quote.last_trade_price ?? undefined}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formatVolume(volume)} vol</span>
          </div>
        </div>

        <div className="space-y-6">
          {eventMarkets.length > 1 && (
            <EventMarkets
              eventTitle={market.event_title ?? mainTitle}
              markets={eventMarkets}
              currentTicker={market.ticker}
            />
          )}
          <ChatPanel context={chatContext} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <MarketRules
          rulesPrimary={market.rules_primary ?? undefined}
          rulesSecondary={market.rules_secondary ?? undefined}
          resolution={market.resolution ?? undefined}
        />
        <OrderbookCard orderbook={orderbook} />
      </section>
    </>
  );
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

  // Try to get market or event
  const result = await getMarketOrEvent(ticker);

  if (!result) {
    notFound();
  }

  if (result.type === "market") {
    const market = result.market;
    const orderbook = await getOrderbook(ticker);

    // Fetch related markets from the same event
    const { getEventMarkets } = await import("@/lib/kalshi");
    const eventMarkets = market.event_ticker
      ? await getEventMarkets(market.event_ticker)
      : [];

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

    return (
      <div className="min-h-screen bg-black text-foreground">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
          <MarketView
            market={market}
            eventMarkets={eventMarkets}
            candlesticks={candlesticks}
            orderbook={orderbook}
          />
        </main>
      </div>
    );
  }

  // Event view
  const event = result.event;
  const leadMarket = event.markets[0];

  const { start, end } = getRecentCandlestickWindow(30);
  const candlesticks = leadMarket?.series_ticker
    ? await getMarketCandlesticks({
      seriesTicker: leadMarket.series_ticker,
      ticker: leadMarket.ticker,
      startTs: start,
      endTs: end,
      periodInterval: 60,
    })
    : [];

  return (
    <div className="min-h-screen bg-black text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
        <EventView
          event={event}
          candlesticks={candlesticks}
        />
      </main>
    </div>
  );
}
