"use client";

import MarketChart from "@/components/market/market-chart";

type Candlestick = { ts: number; close: number | null };

export default function MarketAnalytics({
  candlesticks,
  currentPrice,
}: {
  marketTicker: string;
  candlesticks: Candlestick[];
  currentPrice?: number;
}) {
  return (
    <div className="space-y-4">
      <MarketChart
        candlesticks={candlesticks}
        currentPrice={currentPrice}
      />
    </div>
  );
}
