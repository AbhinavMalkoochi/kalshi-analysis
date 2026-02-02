import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Market } from "@/lib/kalshi";

function formatPrice(value?: number) {
  if (value === undefined || value === null) return "--";
  return `${value}¢`;
}

export default function MarketGrid({ markets }: { markets: Market[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((market) => (
        <Link key={market.ticker} href={`/market/${market.ticker}`}>
          <Card className="h-full border-border/60 bg-black/40 transition hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
                  {market.ticker}
                </Badge>
                <span className="text-xs text-muted-foreground">{market.category ?? "Market"}</span>
              </div>
              <CardTitle className="text-base font-semibold text-foreground">
                {market.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Yes</span>
                <span className="font-mono text-lg text-emerald-300">{formatPrice(market.yes_price)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-muted-foreground">Volume</span>
                <span className="font-mono text-base text-foreground">{market.volume ?? "--"}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
