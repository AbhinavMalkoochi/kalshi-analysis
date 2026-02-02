import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Orderbook } from "@/lib/kalshi";

function renderSide(title: string, side: Array<[number, number]>) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
      <div className="space-y-1 text-sm">
        {side.slice(0, 5).map(([price, quantity]) => (
          <div key={`${title}-${price}-${quantity}`} className="flex justify-between font-mono">
            <span>{price}¢</span>
            <span className="text-muted-foreground">{quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderbookCard({ orderbook }: { orderbook: Orderbook }) {
  return (
    <Card className="border-border/60 bg-black/40">
      <CardHeader>
        <CardTitle className="text-sm text-emerald-200">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        {renderSide("Yes Bids", orderbook.yes)}
        {renderSide("No Bids", orderbook.no)}
      </CardContent>
    </Card>
  );
}
