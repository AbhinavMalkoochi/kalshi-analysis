import SiteHeader from "@/components/site-header";
import MarketChart from "@/components/market/market-chart";
import MarketRules from "@/components/market/market-rules";
import ChatPanel from "@/components/market/chat-panel";
import EventMarkets from "@/components/market/event-markets";
import { notFound } from "next/navigation";
import {
  getMarketOrEvent,
  getTrades,
  tradesToChartData,
  getSeriesInfo,
  deriveSeriesTicker,
  type Market,
  type Event,
  type ChartPoint,
  type SeriesInfo,
} from "@/lib/kalshi";

function formatCloseTime(closeTime: string | null): string | null {
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

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(2)}M`;
  } else if (volume >= 1000) {
    return `$${Math.round(volume / 1000)}K`;
  }
  return `$${volume.toLocaleString()}`;
}

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

function EventView({
  event,
  chartData,
  seriesInfo,
}: {
  event: Event;
  chartData: ChartPoint[];
  seriesInfo: SeriesInfo | null;
}) {
  const totalVolume = event.markets.reduce(
    (sum, m) => sum + (m.volume ?? 0),
    0
  );

  const leadMarket = event.markets.reduce((best, m) =>
    (m.volume ?? 0) > (best.volume ?? 0) ? m : best,
    event.markets[0]
  );

  const forecast = leadMarket?.quote.chance ?? null;

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
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 uppercase tracking-wider">
            {event.category ?? "Event"}
          </span>
          <span className="text-xs font-mono text-gray-500">
            {event.event_ticker}
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-white sm:text-3xl leading-tight">
          {event.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          {forecast !== null && (
            <div>
              <span>Forecast </span>
              <span className="font-mono font-semibold text-emerald-400">{Math.round(forecast)}%</span>
            </div>
          )}
          <div>
            <span className="font-mono text-gray-200">{formatVolume(totalVolume)}</span>
            <span> vol</span>
          </div>
          {leadMarket?.close_time && (
            <span>{formatCloseTime(leadMarket.close_time)}</span>
          )}
        </div>
      </header>

      {/* Main content - Two column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left column: Chart + Options */}
        <div className="space-y-6">
          <MarketChart
            chartData={chartData}
            currentPrice={leadMarket?.quote.mark_price ?? leadMarket?.quote.last_trade_price ?? undefined}
          />

          <EventMarkets
            eventTitle={event.title}
            markets={event.markets}
          />

          {/* Rules below options on left */}
          {leadMarket && (leadMarket.rules_primary || leadMarket.rules_secondary) && (
            <MarketRules
              rulesPrimary={leadMarket.rules_primary ?? undefined}
              rulesSecondary={leadMarket.rules_secondary ?? undefined}
              resolution={leadMarket.resolution ?? undefined}
              rulesUrl={seriesInfo?.contract_terms_url}
            />
          )}
        </div>

        {/* Right column: Chat (prominent) */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ChatPanel context={chatContext} />
        </div>
      </div>
    </>
  );
}

function MarketView({
  market,
  eventMarkets,
  chartData,
  seriesInfo,
}: {
  market: Market;
  eventMarkets: Market[];
  chartData: ChartPoint[];
  seriesInfo: SeriesInfo | null;
}) {
  const mainTitle = market.event_title && market.event_title !== "Combo"
    ? market.event_title
    : market.display_title;

  const volume = market.volume ?? 0;
  const chance = market.quote.chance !== null ? `${market.quote.chance}%` : "—";

  const rules = [
    market.rules_primary,
    market.rules_secondary,
  ].filter(Boolean).join("\n\n");

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
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 uppercase tracking-wider">
            {market.category ?? "Market"}
          </span>
          <span className="text-xs font-mono text-gray-500">
            {market.ticker}
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-white sm:text-3xl leading-tight">
          {mainTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div>
            <span>Chance </span>
            <span className="font-mono font-semibold text-emerald-400">{chance}</span>
          </div>
          <div>
            <span className="font-mono text-gray-200">{formatVolume(volume)}</span>
            <span> vol</span>
          </div>
          {market.close_time && (
            <span>{formatCloseTime(market.close_time)}</span>
          )}
        </div>
      </header>

      {/* Main content - Two column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left column: Chart + Options + Rules */}
        <div className="space-y-6">
          <MarketChart
            chartData={chartData}
            currentPrice={market.quote.mark_price ?? market.quote.last_trade_price ?? undefined}
          />

          {eventMarkets.length > 1 && (
            <EventMarkets
              eventTitle={market.event_title ?? mainTitle}
              markets={eventMarkets}
              currentTicker={market.ticker}
            />
          )}

          <MarketRules
            rulesPrimary={market.rules_primary ?? undefined}
            rulesSecondary={market.rules_secondary ?? undefined}
            resolution={market.resolution ?? undefined}
            rulesUrl={seriesInfo?.contract_terms_url}
          />
        </div>

        {/* Right column: Chat (prominent, sticky) */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ChatPanel context={chatContext} />
        </div>
      </div>
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

  const result = await getMarketOrEvent(ticker);

  if (!result) {
    notFound();
  }

  if (result.type === "market") {
    const market = result.market;

    const { getEventMarkets } = await import("@/lib/kalshi");
    const eventMarkets = market.event_ticker
      ? await getEventMarkets(market.event_ticker)
      : [];

    // Fetch trades for chart
    const trades = await getTrades({ ticker: market.ticker, limit: 1000 });
    const chartData = tradesToChartData(trades);

    // Fetch series info for rules URL
    const seriesTicker = market.event_ticker
      ? deriveSeriesTicker(market.event_ticker)
      : null;
    const seriesInfo = seriesTicker ? await getSeriesInfo(seriesTicker) : null;

    return (
      <div className="min-h-screen bg-black text-gray-100">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
          <MarketView
            market={market}
            eventMarkets={eventMarkets}
            chartData={chartData}
            seriesInfo={seriesInfo}
          />
        </main>
      </div>
    );
  }

  const event = result.event;
  const leadMarket = event.markets[0];

  // Fetch trades for the lead market
  const trades = leadMarket
    ? await getTrades({ ticker: leadMarket.ticker, limit: 1000 })
    : [];
  const chartData = tradesToChartData(trades);

  // Fetch series info for rules URL
  const seriesTicker = deriveSeriesTicker(event.event_ticker);
  const seriesInfo = await getSeriesInfo(seriesTicker);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
        <EventView
          event={event}
          chartData={chartData}
          seriesInfo={seriesInfo}
        />
      </main>
    </div>
  );
}
