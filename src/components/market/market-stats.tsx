import { Card, CardContent } from "@/components/ui/card";
import type { Market } from "@/lib/kalshi";

function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}¢`;
}

function formatVolume(value?: number | null) {
  if (value === undefined || value === null) return "--";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

function Stat({ label, value, subValue }: { label: string; value: string | number; subValue?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="font-mono text-2xl font-semibold text-foreground">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </div>
  );
}

export default function MarketStats({ market }: { market: Market }) {
  const { quote } = market;
  const yesAsk = quote.yes_ask;
  const noAsk = quote.no_ask;
  const yesBid = quote.yes_bid;
  const noBid = quote.no_bid;
  const spread = quote.spread ?? null;

  return (
    <Card className="border-border/60 bg-black/40">
      <CardContent className="py-6">
        <div className="grid gap-6 sm:grid-cols-4">
          <Stat
            label="Yes Price"
            value={formatPrice(yesAsk)}
            subValue={`Buy ${formatPrice(yesAsk)} · Sell ${formatPrice(yesBid)}`}
          />
          <Stat
            label="No Price"
            value={formatPrice(noAsk)}
            subValue={`Buy ${formatPrice(noAsk)} · Sell ${formatPrice(noBid)}`}
          />
          <Stat label="24h Volume" value={formatVolume(market.volume)} />
          <Stat label="Open Interest" value={formatVolume(market.open_interest)} />
        </div>

        {/* Liquidity warning */}
        {quote.has_wide_spread && (
          <div className="mt-4 rounded bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
            Wide spread{spread !== null ? ` (${Math.round(spread)}¢)` : ""} — consider limit orders
          </div>
        )}
      </CardContent>
    </Card>
  );
}
