"use client";

import { useState } from "react";
import type { Market } from "@/lib/kalshi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}¢`;
}

export default function MarketTicket({ market }: { market: Market }) {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [side, setSide] = useState<"yes" | "no">("yes");
  const { quote } = market;

  const buyYes = quote.yes_ask;
  const buyNo = quote.no_ask;
  const sellYes = quote.yes_bid;
  const sellNo = quote.no_bid;

  const activePrice =
    mode === "buy"
      ? side === "yes"
        ? buyYes
        : buyNo
      : side === "yes"
        ? sellYes
        : sellNo;

  const isActionable = activePrice !== null;

  return (
    <div className="rounded-xl border border-border/60 bg-black/40 p-4">
      <div className="flex items-center gap-2 rounded-full bg-black/40 p-1">
        <button
          type="button"
          onClick={() => setMode("buy")}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            mode === "buy"
              ? "bg-emerald-500/20 text-emerald-200"
              : "text-muted-foreground"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setMode("sell")}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            mode === "sell"
              ? "bg-emerald-500/20 text-emerald-200"
              : "text-muted-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setSide("yes")}
          className={`justify-between rounded-full px-4 py-3 text-sm ${
            side === "yes" ? "bg-emerald-600/90 text-white" : "bg-black/40 text-muted-foreground"
          }`}
        >
          <span>Yes</span>
          <span className="font-mono">
            {formatPrice(mode === "buy" ? buyYes : sellYes)}
          </span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setSide("no")}
          className={`justify-between rounded-full px-4 py-3 text-sm ${
            side === "no" ? "bg-rose-600/90 text-white" : "bg-black/40 text-muted-foreground"
          }`}
        >
          <span>No</span>
          <span className="font-mono">
            {formatPrice(mode === "buy" ? buyNo : sellNo)}
          </span>
        </Button>
      </div>

      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Yes bid/ask</span>
          <span className="font-mono text-foreground">
            {formatPrice(sellYes)}/{formatPrice(buyYes)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>No bid/ask</span>
          <span className="font-mono text-foreground">
            {formatPrice(sellNo)}/{formatPrice(buyNo)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Dollars</label>
        <Input
          placeholder="$10"
          className="bg-black/40 font-mono text-sm"
          inputMode="decimal"
        />
      </div>

      {quote.has_wide_spread && (
        <div className="mt-3 rounded bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">
          Wide spread — consider limit orders
        </div>
      )}

      <Button
        type="button"
        className="mt-4 w-full rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
        disabled={!isActionable}
      >
        {isActionable ? "Review order" : "No liquidity"}
      </Button>
    </div>
  );
}
