/**
 * Parse a Kalshi market/event ticker from a URL or raw input.
 * 
 * Kalshi URL formats:
 * - https://kalshi.com/markets/kxspacexcount/spacex-launches/kxspacexcount-26feb
 * - https://kalshi.com/markets/kxspacexcount/spacex-launches
 * - https://kalshi.com/markets/KXHIGHNY-24JAN01-T60
 * 
 * Returns the most specific ticker found (event or market ticker).
 */
export function parseMarketTicker(input: string): string {
  const trimmed = input.trim();
  
  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split("/").filter(Boolean);
    
    // Find the index of "markets" in the path
    const marketsIndex = segments.findIndex((segment) => segment === "markets");
    
    if (marketsIndex !== -1) {
      // Get all segments after "markets"
      const tickerSegments = segments.slice(marketsIndex + 1);
      
      // Filter to find segments that look like tickers (contain alphanumeric + hyphens)
      // Kalshi tickers are uppercase: KXSPACEXCOUNT, KXSPACEXCOUNT-26FEB, KXSPACEXCOUNT-26FEB-10
      const tickerLikeSegments = tickerSegments.filter((seg) => {
        const upper = seg.toUpperCase();
        // Must start with letters and can contain hyphens/numbers
        return /^[A-Z][A-Z0-9-]+$/.test(upper);
      });
      
      if (tickerLikeSegments.length > 0) {
        // Return the last ticker-like segment (most specific: event or market ticker)
        // e.g., from [kxspacexcount, spacex-launches, kxspacexcount-26feb]
        // we want kxspacexcount-26feb
        return tickerLikeSegments[tickerLikeSegments.length - 1].toUpperCase();
      }
      
      // Fallback to first segment after "markets"
      if (segments[marketsIndex + 1]) {
        return segments[marketsIndex + 1].toUpperCase();
      }
    }
  } catch {
    // Not a valid URL, treat as raw ticker
    return trimmed.toUpperCase();
  }

  return trimmed.toUpperCase();
}

/**
 * Determine if a ticker looks like an event ticker or market ticker.
 * Event tickers: KXSPACEXCOUNT-26FEB (series + date suffix)
 * Market tickers: KXSPACEXCOUNT-26FEB-10 (event + strike suffix)
 * Series tickers: KXSPACEXCOUNT (just the series name)
 */
export function classifyTicker(ticker: string): "series" | "event" | "market" {
  const parts = ticker.split("-");
  
  // Market tickers have 3+ parts: SERIES-DATE-STRIKE
  // e.g., KXSPACEXCOUNT-26FEB-10
  if (parts.length >= 3) {
    return "market";
  }
  
  // Event tickers have 2 parts: SERIES-DATE
  // e.g., KXSPACEXCOUNT-26FEB, KXHIGHNY-24JAN01
  if (parts.length === 2) {
    // Check if second part looks like a date suffix (contains alphanumeric)
    const datePart = parts[1];
    if (/^\d{2}[A-Z]{3}\d{0,2}$/.test(datePart) || /^\d{2}[A-Z]{3}$/.test(datePart)) {
      return "event";
    }
    // Could still be event with different format
    return "event";
  }
  
  // Single part is a series ticker
  return "series";
}
