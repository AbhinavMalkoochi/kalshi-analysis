import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Market } from "@/lib/kalshi";

function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}¢`;
}

function formatChance(value?: number | null) {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}%`;
}

type EventMarketsProps = {
  eventTitle: string;
  markets: Market[];
  currentTicker?: string;
};

export default function EventMarkets({ markets, currentTicker }: EventMarketsProps) {
  if (markets.length === 0) return null;
  
  // Sort by chance descending
  const sortedMarkets = [...markets].sort((a, b) => {
    const aChance = a.quote.chance ?? -1;
    const bChance = b.quote.chance ?? -1;
    return bChance - aChance;
  });
  
  return (
    <Card className="border-border/60 bg-black/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Chance
          </CardTitle>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>↕</span>
            <span>⊕</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 pt-0">
        {sortedMarkets.map((market) => {
          const yesAsk = market.quote.yes_ask;
          const noAsk = market.quote.no_ask;
          
          const isCurrentMarket = market.ticker === currentTicker;
          const showWarning = market.quote.has_wide_spread;
          
          return (
            <div
              key={market.ticker}
              className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 ${
                isCurrentMarket
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : "border-border/20 bg-black/20"
              }`}
            >
              {/* Outcome name and probability */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Link
                  href={`/market/${market.ticker}`}
                  className="font-medium text-foreground hover:text-emerald-300 truncate"
                >
                  {market.yes_sub_title || market.display_title}
                </Link>
                
                <span className="font-mono text-lg font-semibold text-white">
                  {formatChance(market.quote.chance)}
                </span>
                
                {showWarning && (
                  <span className="shrink-0 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-400">
                    Wide spread
                  </span>
                )}
              </div>
              
              {/* Yes/No buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {yesAsk === null ? (
                  <span className="flex items-center gap-1.5 rounded bg-emerald-600/30 px-3 py-1.5 text-emerald-100/60">
                    <span className="text-xs font-medium">Yes</span>
                    <span className="font-mono text-sm font-semibold">
                      {formatPrice(yesAsk)}
                    </span>
                  </span>
                ) : (
                  <Link
                    href={`/market/${market.ticker}`}
                    className="flex items-center gap-1.5 rounded bg-emerald-600/90 px-3 py-1.5 transition hover:bg-emerald-600"
                  >
                    <span className="text-xs font-medium text-emerald-100">Yes</span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {formatPrice(yesAsk)}
                    </span>
                  </Link>
                )}
                
                {noAsk === null ? (
                  <span className="flex items-center gap-1.5 rounded bg-rose-600/30 px-3 py-1.5 text-rose-100/60">
                    <span className="text-xs font-medium">No</span>
                    <span className="font-mono text-sm font-semibold">
                      {formatPrice(noAsk)}
                    </span>
                  </span>
                ) : (
                  <Link
                    href={`/market/${market.ticker}`}
                    className="flex items-center gap-1.5 rounded bg-rose-600/90 px-3 py-1.5 transition hover:bg-rose-600"
                  >
                    <span className="text-xs font-medium text-rose-100">No</span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {formatPrice(noAsk)}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        
        {markets.length > 6 && (
          <button className="w-full rounded bg-black/30 py-1.5 text-center text-xs text-muted-foreground hover:text-emerald-300">
            {markets.length - 6} more
          </button>
        )}
      </CardContent>
    </Card>
  );
}
