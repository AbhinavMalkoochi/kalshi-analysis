import { Card, CardContent } from "@/components/ui/card";
import type { Market } from "@/lib/kalshi";

function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "--";
  return `${value}¢`;
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
  // Primary price is yes_ask (cost to buy YES = implied probability)
  // If not available, fall back to yes_bid, then last_price
  const yesPrice = market.yes_ask ?? market.yes_bid ?? market.last_price ?? 0;
  
  // For NO price: use no_ask if available, otherwise calculate from yes_bid
  // In Kalshi: buying NO at no_ask is equivalent to the counterparty buying YES at yes_bid
  let noPrice: number;
  if (market.no_ask !== null && market.no_ask !== undefined) {
    noPrice = market.no_ask;
  } else if (market.yes_bid !== null && market.yes_bid !== undefined) {
    noPrice = 100 - market.yes_bid;
  } else {
    noPrice = 100 - yesPrice;
  }
  
  // Calculate normalized probabilities that add to 100%
  const total = yesPrice + noPrice;
  const normalizedYes = total > 0 ? Math.round((yesPrice / total) * 100) : Math.round(yesPrice);
  const normalizedNo = total > 0 ? Math.round((noPrice / total) * 100) : 100 - normalizedYes;
  
  // Check if market is illiquid (no bids or wide spread)
  const isIlliquid = !market.yes_bid || market.yes_bid === 0;
  const spread = (market.yes_ask ?? 100) - (market.yes_bid ?? 0);
  
  return (
    <Card className="border-border/60 bg-black/40">
      <CardContent className="py-6">
        <div className="grid gap-6 sm:grid-cols-4">
          <Stat 
            label="Yes Price" 
            value={`${normalizedYes}%`}
            subValue={`Buy ${formatPrice(yesPrice)} · Sell ${formatPrice(market.yes_bid)}`}
          />
          <Stat 
            label="No Price" 
            value={`${normalizedNo}%`}
            subValue={`Buy ${formatPrice(noPrice)} · Sell ${formatPrice(market.no_bid)}`}
          />
          <Stat label="24h Volume" value={formatVolume(market.volume)} />
          <Stat label="Open Interest" value={formatVolume(market.open_interest)} />
        </div>
        
        {/* Liquidity warning */}
        {(isIlliquid || spread > 20) && (
          <div className="mt-4 rounded bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
            ⚠️ {isIlliquid ? "Low liquidity - No buyers at current price" : `Wide spread (${spread}¢) - Consider limit orders`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
