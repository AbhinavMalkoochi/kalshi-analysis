const KALSHI_BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

type KalshiMarketRaw = {
  ticker: string;
  title: string;
  subtitle?: string | null;
  yes_bid?: number | null;
  yes_ask?: number | null;
  no_bid?: number | null;
  no_ask?: number | null;
  last_price?: number | null;
  volume?: number | null;
  volume_24h?: number | null;
  open_interest?: number | null;
  close_time?: string | null;
  category?: string | null;
  event_ticker?: string | null;
  series_ticker?: string | null;
  rules_primary?: string | null;
  rules_secondary?: string | null;
  settlement_value?: string | number | null;
  resolution?: string | null;
};

export type Market = {
  ticker: string;
  title: string;
  display_title: string;
  subtitle?: string | null;
  yes_price?: number;
  no_price?: number;
  yes_bid?: number | null;
  yes_ask?: number | null;
  no_bid?: number | null;
  no_ask?: number | null;
  last_price?: number | null;
  volume?: number;
  volume_24h?: number | null;
  open_interest?: number | null;
  close_time?: string | null;
  category?: string | null;
  event_ticker?: string | null;
  series_ticker?: string | null;
  rules_primary?: string | null;
  rules_secondary?: string | null;
  settlement_value?: string | number | null;
  resolution?: string | null;
};

export type OrderbookSide = Array<[number, number]>;

export type Orderbook = {
  yes: OrderbookSide;
  no: OrderbookSide;
};

export type Candlestick = {
  ts: number;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
  previous: number | null;
};

async function kalshiFetch<T>(path: string, params?: Record<string, string>) {
  const url = new URL(`${KALSHI_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Kalshi request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

function pickPrice(...values: Array<number | null | undefined>) {
  return values.find((value) => value !== undefined && value !== null);
}

function normalizeMarket(raw: KalshiMarketRaw): Market {
  const yesPrice = pickPrice(raw.yes_bid, raw.yes_ask, raw.last_price);
  const noPrice = pickPrice(raw.no_bid, raw.no_ask);
  const displayTitle = raw.subtitle?.trim() ? raw.subtitle : raw.title;
  const volume = raw.volume_24h ?? raw.volume ?? undefined;

  return {
    ticker: raw.ticker,
    title: raw.title,
    subtitle: raw.subtitle ?? null,
    display_title: displayTitle,
    yes_price: yesPrice ?? undefined,
    no_price: noPrice ?? undefined,
    yes_bid: raw.yes_bid ?? null,
    yes_ask: raw.yes_ask ?? null,
    no_bid: raw.no_bid ?? null,
    no_ask: raw.no_ask ?? null,
    last_price: raw.last_price ?? null,
    volume,
    volume_24h: raw.volume_24h ?? null,
    open_interest: raw.open_interest ?? null,
    close_time: raw.close_time ?? null,
    category: raw.category ?? null,
    event_ticker: raw.event_ticker ?? null,
    series_ticker: raw.series_ticker ?? null,
    rules_primary: raw.rules_primary ?? null,
    rules_secondary: raw.rules_secondary ?? null,
    settlement_value: raw.settlement_value ?? null,
    resolution: raw.resolution ?? null,
  };
}

export async function getMarkets({
  cursor,
  status = "open",
  limit = 24,
}: {
  cursor?: string;
  status?: string;
  limit?: number;
}) {
  const data = await kalshiFetch<{ markets: KalshiMarketRaw[]; cursor: string }>(
    "/markets",
    {
      status,
      limit: String(limit),
      cursor: cursor ?? "",
    },
  );

  return {
    cursor: data.cursor,
    markets: data.markets.map(normalizeMarket),
  };
}

export async function getMarket(ticker: string) {
  const data = await kalshiFetch<{ market: KalshiMarketRaw }>(
    `/markets/${ticker}`,
  );
  return normalizeMarket(data.market);
}

export async function getOrderbook(ticker: string) {
  const data = await kalshiFetch<{
    orderbook: {
      yes: OrderbookSide | null;
      no: OrderbookSide | null;
    };
  }>(`/markets/${ticker}/orderbook`);

  return {
    yes: data.orderbook.yes ?? [],
    no: data.orderbook.no ?? [],
  };
}

export async function getMarketCandlesticks(params: {
  seriesTicker: string;
  ticker: string;
  startTs: number;
  endTs: number;
  periodInterval?: number;
}) {
  const data = await kalshiFetch<{ candlesticks: Candlestick[] }>(
    `/series/${params.seriesTicker}/markets/${params.ticker}/candlesticks`,
    {
      start_ts: String(params.startTs),
      end_ts: String(params.endTs),
      period_interval: String(params.periodInterval ?? 60),
      include_latest_before_start: "true",
    },
  );

  return data.candlesticks;
}

export function getRecentCandlestickWindow(days = 30) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 60 * 60 * 24 * days;
  return { start, end };
}
