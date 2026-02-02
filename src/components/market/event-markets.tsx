import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Market } from "@/lib/kalshi";

function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "--";
  return `${Math.round(value)}¢`;
}

type EventMarketsProps = {
  eventTitle: string;
  markets: Market[];
  currentTicker?: string;
};

export default function EventMarkets({ markets, currentTicker }: EventMarketsProps) {
  if (markets.length === 0) return null;
  
  // Sort by probability (yes_ask) descending
  const sortedMarkets = [...markets].sort((a, b) => {
    const aPrice = a.yes_ask ?? a.yes_bid ?? a.last_price ?? 0;
    const bPrice = b.yes_ask ?? b.yes_bid ?? b.last_price ?? 0;
    return bPrice - aPrice;
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
          // Use yes_ask as probability/price (cost to buy YES)
          const yesPrice = market.yes_ask ?? market.yes_bid ?? market.last_price ?? 0;
          
          // Use no_ask or calculate from yes_bid (consistent with kalshi.ts)
          let noPrice: number;
          if (market.no_ask !== null && market.no_ask !== undefined) {
            noPrice = market.no_ask;
          } else if (market.yes_bid !== null && market.yes_bid !== undefined) {
            noPrice = 100 - market.yes_bid;
          } else {
            noPrice = 100 - yesPrice;
          }
          
          const isCurrentMarket = market.ticker === currentTicker;
          
          // Check for low liquidity
          const isIlliquid = !market.yes_bid || market.yes_bid === 0;
          
          // Display probability as yes_price (cost to buy YES = implied probability)
          const displayProbability = Math.round(yesPrice);
          
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
                  {displayProbability}%
                </span>
                
                {isIlliquid && (
                  <span className="shrink-0 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-400">
                    Low Vol
                  </span>
                )}
              </div>
              
              {/* Yes/No buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/market/${market.ticker}`}
                  className="flex items-center gap-1.5 rounded bg-emerald-600/90 px-3 py-1.5 transition hover:bg-emerald-600"
                >
                  <span className="text-xs font-medium text-emerald-100">Yes</span>
                  <span className="font-mono text-sm font-semibold text-white">
                    {formatPrice(yesPrice)}
                  </span>
                </Link>
                
                <Link
                  href={`/market/${market.ticker}`}
                  className="flex items-center gap-1.5 rounded bg-rose-600/90 px-3 py-1.5 transition hover:bg-rose-600"
                >
                  <span className="text-xs font-medium text-rose-100">No</span>
                  <span className="font-mono text-sm font-semibold text-white">
                    {formatPrice(noPrice)}
                  </span>
                </Link>
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
