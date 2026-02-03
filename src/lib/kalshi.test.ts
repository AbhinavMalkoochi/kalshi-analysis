import { buildQuote } from "@/lib/kalshi";

describe("buildQuote", () => {
  it("uses midpoint for chance when both sides exist", () => {
    const quote = buildQuote({ yes_bid: 1, yes_ask: 99 });
    expect(quote.yes_ask).toBe(99);
    expect(quote.yes_bid).toBe(1);
    expect(quote.chance).toBe(50);
    expect(quote.has_wide_spread).toBe(true);
  });

  it("keeps actionable asks while chance uses mark/mid", () => {
    const quote = buildQuote({ yes_bid: 60, yes_ask: 68, no_ask: 40, no_bid: 32 });
    expect(quote.yes_ask).toBe(68);
    expect(quote.no_ask).toBe(40);
    expect(quote.chance).toBe(64);
  });

  it("falls back to last trade when midpoint unavailable", () => {
    const quote = buildQuote({ yes_ask: 99, no_ask: 99, last_trade_price: 41 });
    expect(quote.yes_ask).toBe(99);
    expect(quote.no_ask).toBe(99);
    expect(quote.chance).toBe(41);
    expect(quote.has_wide_spread).toBe(true);
  });
});
