import { Card, CardContent } from "@/components/ui/card";
import type { Market } from "@/lib/kalshi";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="font-mono text-lg text-foreground">{value}</p>
    </div>
  );
}

export default function MarketStats({ market }: { market: Market }) {
  return (
    <Card className="border-border/60 bg-black/40">
      <CardContent className="grid gap-6 py-6 sm:grid-cols-4">
        <Stat label="Yes" value={market.yes_price !== undefined ? `${market.yes_price}¢` : "--"} />
        <Stat label="No" value={market.no_price !== undefined ? `${market.no_price}¢` : "--"} />
        <Stat label="24h Volume" value={market.volume ?? "--"} />
        <Stat label="Open Interest" value={market.open_interest ?? "--"} />
      </CardContent>
    </Card>
  );
}
