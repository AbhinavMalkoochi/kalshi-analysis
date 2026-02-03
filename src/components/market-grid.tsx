import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Market } from "@/lib/kalshi";

// Format price in cents to display string
function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}¢`;
}

// Format price as percentage (e.g., 50¢ = 50%)
function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}%`;
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
        const { quote } = market;
        const yesAsk = quote.yes_ask;
        const noAsk = quote.no_ask;
        const chance = quote.chance;
        
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
                {/* Chance + actionable prices */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Chance</span>
                    <span className="font-mono text-2xl font-semibold text-emerald-300">
                      {formatPercent(chance)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-emerald-600/90 px-3 py-1.5 text-xs font-semibold text-white">
                      Yes {formatPrice(yesAsk)}
                    </div>
                    <div className="rounded bg-rose-600/90 px-3 py-1.5 text-xs font-semibold text-white">
                      No {formatPrice(noAsk)}
                    </div>
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
                      {formatPrice(quote.yes_bid)}/{formatPrice(quote.yes_ask)}
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
