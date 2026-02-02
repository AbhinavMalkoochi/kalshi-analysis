const KALSHI_BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

// Full market response from Kalshi API
type KalshiMarketRaw = {
  ticker: string;
  event_ticker?: string | null;
  series_ticker?: string | null;
  market_type?: string | null;
  title: string;
  subtitle?: string | null;
  yes_sub_title?: string | null;
  no_sub_title?: string | null;
  created_time?: string | null;
  open_time?: string | null;
  close_time?: string | null;
  expiration_time?: string | null;
  expected_expiration_time?: string | null;
  status?: string | null;
  result?: string | null;
  // Pricing in cents
  yes_bid?: number | null;
  yes_ask?: number | null;
  no_bid?: number | null;
  no_ask?: number | null;
  last_price?: number | null;
  previous_yes_bid?: number | null;
  previous_yes_ask?: number | null;
  previous_price?: number | null;
  // Pricing in dollars (subpenny)
  yes_bid_dollars?: string | null;
  yes_ask_dollars?: string | null;
  no_bid_dollars?: string | null;
  no_ask_dollars?: string | null;
  last_price_dollars?: string | null;
  // Volume and interest
  volume?: number | null;
  volume_24h?: number | null;
  liquidity?: number | null;
  open_interest?: number | null;
  // Rules and settlement
  rules_primary?: string | null;
  rules_secondary?: string | null;
  settlement_value?: string | number | null;
  resolution?: string | null;
  can_close_early?: boolean | null;
  // Notional values
  notional_value?: number | null;
  notional_value_dollars?: string | null;
  tick_size?: number | null;
  // Category
  category?: string | null;
};

// Event response from Kalshi API
type KalshiEventRaw = {
  event_ticker: string;
  title: string;
  sub_title?: string | null;
  category?: string | null;
  mutually_exclusive?: boolean | null;
  series_ticker?: string | null;
  strike_date?: string | null;
  markets?: KalshiMarketRaw[] | null;
};

// Series response from Kalshi API
type KalshiSeriesRaw = {
  ticker: string;
  title: string;
  category?: string | null;
  frequency?: string | null;
};

// Normalized market for the frontend
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
  // Pricing
  yes_price?: number;
  no_price?: number;
  yes_bid?: number | null;
  yes_ask?: number | null;
  no_bid?: number | null;
  no_ask?: number | null;
  last_price?: number | null;
  // Volume and interest
  volume?: number;
  volume_24h?: number | null;
  open_interest?: number | null;
  liquidity?: number | null;
  // Timing
  close_time?: string | null;
  open_time?: string | null;
  expiration_time?: string | null;
  status?: string | null;
  result?: string | null;
  // Category and tickers
  category?: string | null;
  event_ticker?: string | null;
  series_ticker?: string | null;
  // Rules
  rules_primary?: string | null;
  rules_secondary?: string | null;
  settlement_value?: string | number | null;
  resolution?: string | null;
  // Market type
  market_type?: string | null;
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

// Check if a market is a combo/multi-leg market
function isComboMarket(raw: KalshiMarketRaw): boolean {
  const title = raw.title?.toLowerCase() ?? "";
  // Combo markets have titles like "yes X, yes Y, no Z" or start with "yes " followed by commas
  if (title.startsWith("yes ") && title.includes(",")) return true;
  if (title.startsWith("no ") && title.includes(",")) return true;
  // Check if ticker contains MULTIGAME or similar combo indicators
  if (raw.ticker?.includes("MULTIGAME")) return true;
  return false;
}

function normalizeMarket(
  raw: KalshiMarketRaw,
  meta?: { eventTitle?: string; seriesTitle?: string },
): Market {
  const yesPrice = pickPrice(raw.yes_bid, raw.yes_ask, raw.last_price);
  const noPrice = pickPrice(raw.no_bid, raw.no_ask);
  const title = raw.title?.trim() ?? "";
  const subtitle = raw.subtitle?.trim() ?? "";
  const yesSubTitle = raw.yes_sub_title?.trim() ?? "";
  const seriesTitle = meta?.seriesTitle?.trim() ?? null;
  const eventTitle = meta?.eventTitle?.trim() ?? null;
  
  const isCombo = isComboMarket(raw);
  
  // Determine the best display title
  let displayTitle = title;
  let displayDetail: string | null = null;
  
  if (isCombo) {
    // For combo markets, use event/series title if available
    displayTitle = "Combo";
    displayDetail = "Multi-leg combo";
  } else if (yesSubTitle && yesSubTitle !== title) {
    // Use yes subtitle if it's different and informative
    displayTitle = yesSubTitle;
  } else if (subtitle && subtitle !== title) {
    displayTitle = subtitle;
  }
  
  // If we still have a generic title, try to use event or series title
  if (displayTitle === title || displayTitle === "Combo") {
    if (eventTitle && eventTitle !== "Combo") {
      displayTitle = eventTitle;
    } else if (seriesTitle) {
      displayTitle = seriesTitle;
    }
  }
  
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
    is_combo: isCombo,
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
    liquidity: raw.liquidity ?? null,
    close_time: raw.close_time ?? null,
    open_time: raw.open_time ?? null,
    expiration_time: raw.expiration_time ?? null,
    status: raw.status ?? null,
    result: raw.result ?? null,
    category: raw.category ?? null,
    event_ticker: raw.event_ticker ?? null,
    series_ticker: raw.series_ticker ?? null,
    rules_primary: raw.rules_primary ?? null,
    rules_secondary: raw.rules_secondary ?? null,
    settlement_value: raw.settlement_value ?? null,
    resolution: raw.resolution ?? null,
    market_type: raw.market_type ?? null,
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
      mve_filter: "exclude", // Exclude multivariate/combo markets
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
  
  const markets = data.markets.map((market) =>
    normalizeMarket(market, {
      eventTitle: market.event_ticker ? eventTitles[market.event_ticker] : undefined,
      seriesTitle: market.series_ticker
        ? seriesTitles[market.series_ticker]
        : undefined,
    }),
  );

  return {
    cursor: data.cursor,
    markets,
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

// Event with nested markets
export type Event = {
  event_ticker: string;
  title: string;
  sub_title?: string | null;
  category?: string | null;
  series_ticker?: string | null;
  mutually_exclusive?: boolean | null;
  strike_date?: string | null;
  markets: Market[];
};

// Get event with nested markets - this is how Kalshi structures betting options
export async function getEvent(eventTicker: string): Promise<Event | null> {
  try {
    const data = await kalshiFetch<{ event: KalshiEventRaw & { markets?: KalshiMarketRaw[] } }>(
      `/events/${eventTicker}`,
      { with_nested_markets: "true" },
    );
    
    const event = data.event;
    const seriesTitle = event.series_ticker
      ? await getSeriesTitle(event.series_ticker)
      : undefined;
    
    const markets = (event.markets ?? []).map((market) =>
      normalizeMarket(market, {
        eventTitle: event.title,
        seriesTitle,
      }),
    );
    
    return {
      event_ticker: event.event_ticker,
      title: event.title,
      sub_title: event.sub_title ?? null,
      category: event.category ?? null,
      series_ticker: event.series_ticker ?? null,
      mutually_exclusive: event.mutually_exclusive ?? null,
      strike_date: event.strike_date ?? null,
      markets,
    };
  } catch {
    return null;
  }
}

// Get events list with optional nested markets
export async function getEvents({
  cursor,
  status = "open",
  limit = 24,
  withNestedMarkets = false,
  seriesTicker,
}: {
  cursor?: string;
  status?: string;
  limit?: number;
  withNestedMarkets?: boolean;
  seriesTicker?: string;
}) {
  const data = await kalshiFetch<{ events: KalshiEventRaw[]; cursor: string }>(
    "/events",
    {
      status,
      limit: String(limit),
      cursor: cursor ?? "",
      with_nested_markets: withNestedMarkets ? "true" : "false",
      series_ticker: seriesTicker ?? "",
    },
  );

  const events: Event[] = [];
  
  for (const event of data.events) {
    const seriesTitle = event.series_ticker
      ? await getSeriesTitle(event.series_ticker)
      : undefined;
    
    const markets = (event.markets ?? []).map((market) =>
      normalizeMarket(market, {
        eventTitle: event.title,
        seriesTitle,
      }),
    );
    
    events.push({
      event_ticker: event.event_ticker,
      title: event.title,
      sub_title: event.sub_title ?? null,
      category: event.category ?? null,
      series_ticker: event.series_ticker ?? null,
      mutually_exclusive: event.mutually_exclusive ?? null,
      strike_date: event.strike_date ?? null,
      markets,
    });
  }

  return {
    cursor: data.cursor,
    events,
  };
}

// Get markets for a specific event
export async function getEventMarkets(eventTicker: string): Promise<Market[]> {
  const data = await kalshiFetch<{ markets: KalshiMarketRaw[] }>(
    "/markets",
    {
      event_ticker: eventTicker,
      status: "open",
      limit: "100",
    },
  );
  
  const eventTitle = await getEventTitle(eventTicker);
  
  return data.markets.map((market) =>
    normalizeMarket(market, { eventTitle }),
  );
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

// ============================================================================
// EVENT GROUPING - Groups individual markets by their event_ticker
// ============================================================================

// A market outcome represents one betting option within an event
export type MarketOutcome = {
  ticker: string;
  name: string; // The outcome name (e.g., "Jakub Kaczmarek", "Trump", etc.)
  // Pricing - yes_ask is the cost to buy YES (also the implied probability)
  probability: number; // Derived from yes_ask (0-100)
  yes_price: number; // yes_ask in cents (cost to buy YES)
  no_price: number; // no_ask or 100 - yes_price (cost to buy NO)
  yes_bid: number | null;
  yes_ask: number | null;
  no_bid: number | null;
  no_ask: number | null;
  // Volume
  volume_24h: number | null;
  open_interest: number | null;
  liquidity: number | null;
  // Status
  is_illiquid: boolean; // true if yes_bid is 0 or spread is too wide
};

// A grouped event containing all its outcomes
export type GroupedEvent = {
  event_ticker: string;
  title: string; // The event title (e.g., "Jakub Kaczmarek vs. Grzegorz Marud")
  subtitle?: string | null;
  category?: string | null;
  series_ticker?: string | null;
  close_time?: string | null;
  outcomes: MarketOutcome[]; // All the betting options for this event
  total_volume: number;
  is_binary: boolean; // true if there's only one market (Yes/No on same ticker)
};

// Extract a clean outcome name from market data
function extractOutcomeName(market: Market): string {
  // Priority: yes_sub_title > subtitle > extract from title
  if (market.yes_sub_title) {
    return market.yes_sub_title;
  }
  
  // Try to extract from title patterns like "Will X win?" -> "X"
  const title = market.title || "";
  
  // Pattern: "If X wins..." or "Will X win..."
  const willWinMatch = title.match(/(?:Will|If)\s+(.+?)\s+win/i);
  if (willWinMatch) {
    return willWinMatch[1].trim();
  }
  
  // Pattern: just use subtitle if available
  if (market.subtitle && market.subtitle !== title) {
    return market.subtitle;
  }
  
  // Fallback to display title or title
  return market.display_title || title;
}

// Calculate probability from pricing data
function calculateProbability(market: Market): number {
  // Best estimate is yes_ask (the price to buy YES)
  // If not available, fall back to yes_bid, then last_price
  const price = market.yes_ask ?? market.yes_bid ?? market.last_price ?? 0;
  return Math.min(100, Math.max(0, price));
}

// Check if a market is illiquid (wide spread or no buyers)
function isMarketIlliquid(market: Market): boolean {
  // If yes_bid is 0 or null, there are no buyers -> illiquid
  if (!market.yes_bid || market.yes_bid === 0) {
    return true;
  }
  
  // If spread is > 20 cents, consider it illiquid
  const yesBid = market.yes_bid ?? 0;
  const yesAsk = market.yes_ask ?? 100;
  const spread = yesAsk - yesBid;
  
  return spread > 20;
}

// Convert a raw Market to a MarketOutcome
function marketToOutcome(market: Market): MarketOutcome {
  const probability = calculateProbability(market);
  
  // Use actual ask prices from API
  // yes_ask = cost to buy YES (this is what Kalshi displays)
  // no_ask = cost to buy NO
  // If no_ask isn't available, calculate from yes_bid (100 - yes_bid)
  const yesPrice = market.yes_ask ?? market.yes_bid ?? market.last_price ?? 0;
  
  // For NO price: use no_ask if available, otherwise calculate from yes_bid
  // This matches Kalshi's UI where No 48¢ = 100 - yes_bid(52)
  let noPrice: number;
  if (market.no_ask !== null && market.no_ask !== undefined) {
    noPrice = market.no_ask;
  } else if (market.yes_bid !== null && market.yes_bid !== undefined) {
    // No ask ≈ 100 - yes_bid (plus some spread)
    noPrice = 100 - market.yes_bid;
  } else {
    noPrice = 100 - yesPrice;
  }
  
  return {
    ticker: market.ticker,
    name: extractOutcomeName(market),
    probability,
    yes_price: yesPrice,
    no_price: noPrice,
    yes_bid: market.yes_bid ?? null,
    yes_ask: market.yes_ask ?? null,
    no_bid: market.no_bid ?? null,
    no_ask: market.no_ask ?? null,
    volume_24h: market.volume_24h ?? null,
    open_interest: market.open_interest ?? null,
    liquidity: market.liquidity ?? null,
    is_illiquid: isMarketIlliquid(market),
  };
}

// Group markets by event_ticker into GroupedEvents
export function groupMarketsByEvent(markets: Market[]): GroupedEvent[] {
  const eventMap = new Map<string, {
    markets: Market[];
    eventTitle?: string | null;
    category?: string | null;
    seriesTicker?: string | null;
    closeTime?: string | null;
  }>();
  
  // Group markets by event_ticker
  for (const market of markets) {
    const eventTicker = market.event_ticker;
    if (!eventTicker) continue;
    
    if (!eventMap.has(eventTicker)) {
      eventMap.set(eventTicker, {
        markets: [],
        eventTitle: market.event_title,
        category: market.category,
        seriesTicker: market.series_ticker,
        closeTime: market.close_time,
      });
    }
    
    eventMap.get(eventTicker)!.markets.push(market);
  }
  
  // Convert to GroupedEvent array
  const groupedEvents: GroupedEvent[] = [];
  
  for (const [eventTicker, data] of eventMap) {
    const outcomes = data.markets.map(marketToOutcome);
    
    // Sort outcomes by probability (highest first)
    outcomes.sort((a, b) => b.probability - a.probability);
    
    // Calculate total volume
    const totalVolume = outcomes.reduce(
      (sum, o) => sum + (o.volume_24h ?? 0),
      0
    );
    
    // Determine event title
    // First market's event_title is usually the best
    let title = data.eventTitle || "";
    
    // If title is empty or generic, try to construct from outcomes
    if (!title || title === "Combo") {
      if (outcomes.length === 2) {
        // Binary event: "X vs Y"
        title = `${outcomes[0].name} vs ${outcomes[1].name}`;
      } else if (outcomes.length > 0) {
        // Use first outcome's name as base
        title = outcomes[0].name;
      }
    }
    
    groupedEvents.push({
      event_ticker: eventTicker,
      title,
      subtitle: null,
      category: data.category,
      series_ticker: data.seriesTicker,
      close_time: data.closeTime,
      outcomes,
      total_volume: totalVolume,
      is_binary: outcomes.length === 1, // Single market with Yes/No options
    });
  }
  
  // Sort events by total volume (most active first)
  groupedEvents.sort((a, b) => b.total_volume - a.total_volume);
  
  return groupedEvents;
}

// Fetch markets and return them grouped by event
export async function getGroupedMarkets({
  cursor,
  status = "open",
  limit = 100, // Fetch more to ensure good grouping
}: {
  cursor?: string;
  status?: string;
  limit?: number;
}) {
  const { markets, cursor: nextCursor } = await getMarkets({ cursor, status, limit });
  const events = groupMarketsByEvent(markets);
  
  return {
    cursor: nextCursor,
    events,
  };
}
