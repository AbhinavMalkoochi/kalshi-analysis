const KALSHI_BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

export type Market = {
  ticker: string;
  title: string;
  yes_price?: number;
  no_price?: number;
  volume?: number;
  open_interest?: number;
  close_time?: string;
  category?: string;
  event_ticker?: string;
  series_ticker?: string;
  rules_primary?: string;
  rules_secondary?: string;
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

export async function getMarkets({
  cursor,
  status = "open",
  limit = 24,
}: {
  cursor?: string;
  status?: string;
  limit?: number;
}) {
  const data = await kalshiFetch<{ markets: Market[]; cursor: string }>(
    "/markets",
    {
      status,
      limit: String(limit),
      cursor: cursor ?? "",
    },
  );

  return data;
}

export async function getMarket(ticker: string) {
  const data = await kalshiFetch<{ market: Market }>(`/markets/${ticker}`);
  return data.market;
}

export async function getOrderbook(ticker: string) {
  const data = await kalshiFetch<{ orderbook: Orderbook }>(
    `/markets/${ticker}/orderbook`,
  );
  return data.orderbook;
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
