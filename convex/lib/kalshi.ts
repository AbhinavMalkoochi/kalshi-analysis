const KALSHI_BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

export type KalshiMarket = {
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

export type KalshiCandlestick = {
  ts: number;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
  previous: number | null;
};

export type KalshiOrderbookSide = Array<[number, number]>;

export type KalshiOrderbook = {
  yes: KalshiOrderbookSide;
  no: KalshiOrderbookSide;
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
  });

  if (!response.ok) {
    throw new Error(`Kalshi request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getMarket(ticker: string) {
  const data = await kalshiFetch<{ market: KalshiMarket }>(`/markets/${ticker}`);
  return data.market;
}

export async function getOrderbook(ticker: string) {
  const data = await kalshiFetch<{ orderbook: KalshiOrderbook }>(
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
  const data = await kalshiFetch<{ candlesticks: KalshiCandlestick[] }>(
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
