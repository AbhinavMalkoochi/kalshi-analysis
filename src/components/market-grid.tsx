import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Market } from "@/lib/kalshi";

// Format price in cents to display string
function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "--";
  return `${value}¢`;
}

// Format price as percentage (e.g., 50¢ = 50%)
function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "--";
  return `${value}%`;
}

// Format volume with K/M suffixes
function formatVolume(value?: number | null) {
  if (value === undefined || value === null) return "--";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

export default function MarketGrid({ markets }: { markets: Market[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((market) => {
        // Calculate yes/no prices based on available data
        const yesPrice = market.yes_price ?? market.yes_bid ?? market.last_price ?? 0;
        
        // For NO price: use no_price if available, otherwise calculate from yes_bid
        let noPrice: number;
        if (market.no_price !== undefined && market.no_price !== null) {
          noPrice = market.no_price;
        } else if (market.no_bid !== undefined && market.no_bid !== null) {
          noPrice = market.no_bid;
        } else if (market.yes_bid !== undefined && market.yes_bid !== null) {
          noPrice = 100 - market.yes_bid;
        } else {
          noPrice = 100 - yesPrice;
        }
        
        return (
          <Link key={market.ticker} href={`/market/${market.ticker}`}>
            <Card className="h-full border-emerald-500/20 bg-neutral-950/80 shadow-[0_0_20px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              <CardHeader className="pb-2">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <Badge
                    variant="outline"
                    className="max-w-[70%] truncate border-emerald-500/40 text-emerald-200"
                  >
                    {market.ticker.length > 20 
                      ? `${market.ticker.slice(0, 20)}...` 
                      : market.ticker}
                  </Badge>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {market.category ?? "Market"}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-base font-semibold text-foreground">
                  {market.display_title}
                </CardTitle>
                {market.display_detail ? (
                  <p className="text-xs text-muted-foreground">
                    {market.display_detail}
                  </p>
                ) : market.yes_sub_title && market.yes_sub_title !== market.display_title ? (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {market.yes_sub_title}
                  </p>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Pricing row */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Yes</span>
                    <span className="font-mono text-xl font-semibold text-emerald-300">
                      {formatPercent(yesPrice)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatPrice(yesPrice)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">No</span>
                    <span className="font-mono text-xl font-semibold text-red-400">
                      {formatPercent(noPrice)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatPrice(noPrice)}
                    </span>
                  </div>
                </div>
                
                {/* Stats row */}
                <div className="flex items-center justify-between border-t border-border/30 pt-2 text-xs text-muted-foreground">
                  <div className="flex flex-col">
                    <span>24h Vol</span>
                    <span className="font-mono text-foreground">{formatVolume(market.volume)}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>Bid/Ask</span>
                    <span className="font-mono text-foreground">
                      {formatPrice(market.yes_bid)}/{formatPrice(market.yes_ask)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>Open Int</span>
                    <span className="font-mono text-foreground">{formatVolume(market.open_interest)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
