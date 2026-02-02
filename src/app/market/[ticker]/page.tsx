import SiteHeader from "@/components/site-header";
import MarketStats from "@/components/market/market-stats";
import MarketAnalytics from "@/components/market/market-analytics";
import OrderbookCard from "@/components/market/orderbook";
import MarketRules from "@/components/market/market-rules";
import ChatPanel from "@/components/market/chat-panel";
import {
  getMarket,
  getMarketCandlesticks,
  getOrderbook,
  getRecentCandlestickWindow,
} from "@/lib/kalshi";

export default async function MarketPage({
  params,
}: {
  params: { ticker: string };
}) {
  const ticker = params.ticker.toUpperCase();
  const market = await getMarket(ticker);
  const orderbook = await getOrderbook(ticker);

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
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
            Market View
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            {market.title}
          </h1>
          <p className="text-sm text-muted-foreground">Ticker: {market.ticker}</p>
        </section>

        <MarketStats market={market} />

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <MarketAnalytics marketTicker={ticker} candlesticks={candlesticks} />
          <ChatPanel marketTicker={ticker} context={context} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <MarketRules
            rulesPrimary={market.rules_primary}
            rulesSecondary={market.rules_secondary}
            resolution={market.resolution}
          />
          <OrderbookCard orderbook={orderbook} />
        </section>
      </main>
    </div>
  );
}
