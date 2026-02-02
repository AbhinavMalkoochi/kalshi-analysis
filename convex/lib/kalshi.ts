const KALSHI_BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

export type KalshiMarket = {
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
