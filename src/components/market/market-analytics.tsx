"use client";

import { useState } from "react";
import MarketChart from "@/components/market/market-chart";
import AnalysisPanel, { AnalysisReport } from "@/components/market/analysis-panel";

type Candlestick = { ts: number; close: number | null };

export default function MarketAnalytics({
  marketTicker,
  candlesticks,
}: {
  marketTicker: string;
  candlesticks: Candlestick[];
}) {
  const [report, setReport] = useState<AnalysisReport | null>(null);

  return (
    <div className="space-y-4">
      <MarketChart candlesticks={candlesticks} annotations={report?.annotations} />
      <AnalysisPanel marketTicker={marketTicker} onReport={setReport} />
    </div>
  );
}
