import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Market } from "@/lib/kalshi";

function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "--";
  return `${value}¢`;
}

export default function MarketGrid({ markets }: { markets: Market[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((market) => (
        <Link key={market.ticker} href={`/market/${market.ticker}`}>
          <Card className="h-full border-emerald-500/20 bg-neutral-950/80 shadow-[0_0_20px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <CardHeader>
              <div className="flex min-w-0 items-center justify-between gap-3">
                <Badge
                  variant="outline"
                  className="max-w-[70%] truncate border-emerald-500/40 text-emerald-200"
                >
                  {market.ticker}
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
              ) : null}
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Yes</span>
                <span className="font-mono text-lg text-emerald-300">{formatPrice(market.yes_price)}</span>
                <span className="text-[10px] text-muted-foreground">
                  Bid {formatPrice(market.yes_bid)} · Ask {formatPrice(market.yes_ask)}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-muted-foreground">24h Volume</span>
                <span className="font-mono text-base text-foreground">{market.volume ?? "--"}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
