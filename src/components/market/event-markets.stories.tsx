import type { Meta, StoryObj } from "@storybook/react";
import EventMarkets from "@/components/market/event-markets";
import { buildQuote, type Market } from "@/lib/kalshi";

const makeMarket = (overrides: Partial<Market>): Market => ({
  ticker: "KXTEST-YES",
  title: "Will Team A win?",
  display_title: "Team A",
  display_detail: null,
  subtitle: null,
  yes_sub_title: "Team A",
  no_sub_title: null,
  event_title: "Team A vs Team B",
  series_title: "KXTEST",
  is_combo: false,
  yes_bid: 45,
  yes_ask: 55,
  no_bid: 45,
  no_ask: 55,
  last_price: 52,
  yes_bid_size: null,
  yes_ask_size: null,
  no_bid_size: null,
  no_ask_size: null,
  mark_price: null,
  market_price: null,
  yes_price: null,
  tick_size: 1,
  quote: buildQuote({ yes_bid: 45, yes_ask: 55, no_bid: 45, no_ask: 55, last_trade_price: 52 }),
  volume: 12345,
  volume_24h: 12345,
  open_interest: 53210,
  liquidity: 100,
  close_time: null,
  open_time: null,
  expiration_time: null,
  status: "open",
  result: null,
  category: "sports",
  event_ticker: "KXTEST",
  series_ticker: "KXTEST",
  rules_primary: null,
  rules_secondary: null,
  settlement_value: null,
  resolution: null,
  market_type: null,
  ...overrides,
});

const markets: Market[] = [
  makeMarket({
    ticker: "KXTEST-A",
    display_title: "Team A",
    yes_sub_title: "Team A",
    yes_bid: 45,
    yes_ask: 55,
    no_bid: 45,
    no_ask: 55,
    quote: buildQuote({ yes_bid: 45, yes_ask: 55, no_bid: 45, no_ask: 55 }),
  }),
  makeMarket({
    ticker: "KXTEST-B",
    display_title: "Team B",
    yes_sub_title: "Team B",
    yes_bid: 35,
    yes_ask: 65,
    no_bid: 35,
    no_ask: 65,
    quote: buildQuote({ yes_bid: 35, yes_ask: 65, no_bid: 35, no_ask: 65 }),
  }),
  makeMarket({
    ticker: "KXTEST-C",
    display_title: "Team C",
    yes_sub_title: "Team C",
    yes_bid: 10,
    yes_ask: 90,
    no_bid: 10,
    no_ask: 90,
    quote: buildQuote({ yes_bid: 10, yes_ask: 90, no_bid: 10, no_ask: 90 }),
  }),
];

const meta: Meta<typeof EventMarkets> = {
  component: EventMarkets,
  title: "Market/EventMarkets",
  args: {
    eventTitle: "Team A vs Team B",
    markets,
    currentTicker: "KXTEST-A",
  },
};

export default meta;

export const Default: StoryObj<typeof EventMarkets> = {
  args: {
    eventTitle: "Team A vs Team B",
    markets,
    currentTicker: "KXTEST-A",
  },
};
