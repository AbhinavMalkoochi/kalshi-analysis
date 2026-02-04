"use client";

import { useState } from "react";
import type { Market } from "@/lib/kalshi";

function formatPrice(value?: number | null): string {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}¢`;
}

function formatChance(value?: number | null): string {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}%`;
}

type EventMarketsProps = {
  eventTitle: string;
  markets: Market[];
  currentTicker?: string;
};

const MAX_VISIBLE = 5;

export default function EventMarkets({ markets, currentTicker }: EventMarketsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (markets.length === 0) return null;

  const sortedMarkets = [...markets].sort((a, b) => {
    const aChance = a.quote.chance ?? -1;
    const bChance = b.quote.chance ?? -1;
    return bChance - aChance;
  });

  const visibleMarkets = isExpanded ? sortedMarkets : sortedMarkets.slice(0, MAX_VISIBLE);
  const hasMore = markets.length > MAX_VISIBLE;

  return (
    <div className="rounded-lg border border-gray-700/80 bg-gray-900/90 shadow-lg">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-200">Market Options</span>
          <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
            {markets.length}
          </span>
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Options table */}
      <div className={`overflow-hidden transition-all ${isExpanded ? "max-h-[500px]" : "max-h-[280px]"} overflow-y-auto`}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-900/95 backdrop-blur">
            <tr className="border-b border-gray-700/50 text-xs text-gray-400">
              <th className="px-4 py-2 text-left font-medium">Outcome</th>
              <th className="px-4 py-2 text-right font-medium">Chance</th>
              <th className="px-4 py-2 text-right font-medium">Yes</th>
              <th className="px-4 py-2 text-right font-medium">No</th>
            </tr>
          </thead>
          <tbody>
            {visibleMarkets.map((market) => {
              const isCurrentMarket = market.ticker === currentTicker;
              const showWarning = market.quote.has_wide_spread;

              return (
                <tr
                  key={market.ticker}
                  className={`border-b border-gray-800/50 transition-colors ${isCurrentMarket
                      ? "bg-emerald-500/10"
                      : "hover:bg-gray-800/30"
                    }`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100 truncate max-w-[200px]">
                        {market.yes_sub_title || market.display_title}
                      </span>
                      {showWarning && (
                        <span className="shrink-0 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-400">
                          Wide
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="font-mono font-semibold text-white">
                      {formatChance(market.quote.chance)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="font-mono text-emerald-400">
                      {formatPrice(market.quote.yes_ask)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="font-mono text-rose-400">
                      {formatPrice(market.quote.no_ask)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Show more/less */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full border-t border-gray-700/50 px-4 py-2 text-center text-xs text-emerald-400 hover:bg-gray-800/30 transition-colors"
        >
          {isExpanded ? "Show less" : `View all ${markets.length} options`}
        </button>
      )}
    </div>
  );
}
