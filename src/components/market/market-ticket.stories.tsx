import type { Meta, StoryObj } from "@storybook/react";
import MarketTicket from "@/components/market/market-ticket";
import { buildQuote, type Market } from "@/lib/kalshi";

const market: Market = {
  ticker: "KXTEST-YES",
  title: "Will Team A win?",
  display_title: "Team A to win",
  display_detail: null,
  subtitle: null,
  yes_sub_title: "Team A",
  no_sub_title: "Team B",
  event_title: "Team A vs Team B",
  series_title: "KXTEST",
  is_combo: false,
  yes_bid: 46,
  yes_ask: 54,
  no_bid: 46,
  no_ask: 54,
  last_price: 52,
  yes_bid_size: null,
  yes_ask_size: null,
  no_bid_size: null,
  no_ask_size: null,
  mark_price: null,
  market_price: null,
  yes_price: null,
  tick_size: 1,
  quote: buildQuote({ yes_bid: 46, yes_ask: 54, no_bid: 46, no_ask: 54, last_trade_price: 52 }),
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
};

const meta: Meta<typeof MarketTicket> = {
  component: MarketTicket,
  title: "Market/MarketTicket",
  args: { market },
};

export default meta;

export const Default: StoryObj<typeof MarketTicket> = {
  args: { market },
};
