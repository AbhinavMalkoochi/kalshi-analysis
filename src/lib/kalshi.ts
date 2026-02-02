const KALSHI_BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

type KalshiMarketRaw = {
  ticker: string;
  title: string;
  subtitle?: string | null;
  yes_sub_title?: string | null;
  no_sub_title?: string | null;
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

type KalshiEventRaw = {
  event_ticker: string;
  title: string;
  sub_title?: string | null;
};

type KalshiSeriesRaw = {
  ticker: string;
  title: string;
};

export type Market = {
  ticker: string;
  title: string;
  display_title: string;
  display_detail?: string | null;
  subtitle?: string | null;
  yes_sub_title?: string | null;
  no_sub_title?: string | null;
  event_title?: string | null;
  series_title?: string | null;
  is_combo?: boolean;
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

function normalizeMarket(
  raw: KalshiMarketRaw,
  meta?: { eventTitle?: string; seriesTitle?: string },
): Market {
  const yesPrice = pickPrice(raw.yes_bid, raw.yes_ask, raw.last_price);
  const noPrice = pickPrice(raw.no_bid, raw.no_ask);
  const title = raw.title?.trim() ?? "";
  const subtitle = raw.subtitle?.trim() ?? "";
  const seriesTitle = meta?.seriesTitle?.trim() ?? null;
  const eventTitle = meta?.eventTitle?.trim() ?? null;
  const isComboTitle = title.toLowerCase().startsWith("yes ") && title.includes(",");
  const displayTitle = isComboTitle
    ? seriesTitle || eventTitle || subtitle || title
    : subtitle || title;
  const displayDetail = isComboTitle ? "Multi-leg combo" : null;
  const volume = raw.volume_24h ?? raw.volume ?? undefined;

  return {
    ticker: raw.ticker,
    title: raw.title,
    subtitle: raw.subtitle ?? null,
    yes_sub_title: raw.yes_sub_title ?? null,
    no_sub_title: raw.no_sub_title ?? null,
    display_title: displayTitle,
    display_detail: displayDetail,
    event_title: eventTitle,
    series_title: seriesTitle,
    is_combo: isComboTitle,
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

async function getEventTitle(eventTicker: string) {
  try {
    const data = await kalshiFetch<{ event: KalshiEventRaw }>(
      `/events/${eventTicker}`,
    );
    return data.event?.title;
  } catch {
    return undefined;
  }
}

async function getSeriesTitle(seriesTicker: string) {
  try {
    const data = await kalshiFetch<{ series: KalshiSeriesRaw }>(
      `/series/${seriesTicker}`,
    );
    return data.series?.title;
  } catch {
    return undefined;
  }
}

async function buildTitleMap(
  tickers: string[],
  resolver: (ticker: string) => Promise<string | undefined>,
) {
  if (tickers.length === 0) return {} as Record<string, string>;
  const results = await Promise.allSettled(tickers.map((ticker) => resolver(ticker)));
  return tickers.reduce<Record<string, string>>((acc, ticker, index) => {
    const result = results[index];
    if (result.status === "fulfilled" && result.value) {
      acc[ticker] = result.value;
    }
    return acc;
  }, {});
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

  const eventTickers = Array.from(
    new Set(
      data.markets
        .map((market) => market.event_ticker)
        .filter((ticker): ticker is string => Boolean(ticker)),
    ),
  );
  const seriesTickers = Array.from(
    new Set(
      data.markets
        .map((market) => market.series_ticker)
        .filter((ticker): ticker is string => Boolean(ticker)),
    ),
  );

  const [eventTitles, seriesTitles] = await Promise.all([
    buildTitleMap(eventTickers, getEventTitle),
    buildTitleMap(seriesTickers, getSeriesTitle),
  ]);

  return {
    cursor: data.cursor,
    markets: data.markets.map((market) =>
      normalizeMarket(market, {
        eventTitle: market.event_ticker ? eventTitles[market.event_ticker] : undefined,
        seriesTitle: market.series_ticker
          ? seriesTitles[market.series_ticker]
          : undefined,
      }),
    ),
  };
}

export async function getMarket(ticker: string) {
  const data = await kalshiFetch<{ market: KalshiMarketRaw }>(
    `/markets/${ticker}`,
  );
  const [eventTitle, seriesTitle] = await Promise.all([
    data.market.event_ticker ? getEventTitle(data.market.event_ticker) : undefined,
    data.market.series_ticker ? getSeriesTitle(data.market.series_ticker) : undefined,
  ]);
  return normalizeMarket(data.market, { eventTitle, seriesTitle });
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
