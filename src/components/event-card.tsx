"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GroupedEvent, MarketOutcome } from "@/lib/kalshi";

// Format price in cents
function formatPrice(value: number) {
  return `${Math.round(value)}¢`;
}

// Format volume with K/M suffixes
function formatVolume(value: number | null) {
  if (value === null || value === undefined) return "--";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
}

// Single outcome row - matches Kalshi's style
// For multi-outcome events, shows the probability this specific outcome wins
function OutcomeRow({ outcome, showPercentage = true }: { outcome: MarketOutcome; showPercentage?: boolean }) {
  // Normalized probability - yes_price represents cost to buy YES (implied probability)
  // In multi-outcome events, this is the chance this specific outcome wins
  const displayProbability = Math.round(outcome.yes_price);
  
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border/20 bg-black/20 px-3 py-2">
      {/* Outcome name and probability */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Link
          href={`/market/${outcome.ticker}`}
          className="font-medium text-foreground hover:text-emerald-300 truncate"
        >
          {outcome.name}
        </Link>
        
        {showPercentage && (
          <span className="font-mono text-lg font-semibold text-white">
            {displayProbability}%
          </span>
        )}
        
        {/* Illiquid indicator */}
        {outcome.is_illiquid && (
          <span className="shrink-0 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-400">
            Low Vol
          </span>
        )}
      </div>
      
      {/* Buy buttons - Kalshi style */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Yes button */}
        <Link
          href={`/market/${outcome.ticker}`}
          className="flex items-center gap-1.5 rounded bg-emerald-600/90 px-3 py-1.5 transition hover:bg-emerald-600"
        >
          <span className="text-xs font-medium text-emerald-100">Yes</span>
          <span className="font-mono text-sm font-semibold text-white">
            {formatPrice(outcome.yes_price)}
          </span>
        </Link>
        
        {/* No button */}
        <Link
          href={`/market/${outcome.ticker}`}
          className="flex items-center gap-1.5 rounded bg-rose-600/90 px-3 py-1.5 transition hover:bg-rose-600"
        >
          <span className="text-xs font-medium text-rose-100">No</span>
          <span className="font-mono text-sm font-semibold text-white">
            {formatPrice(outcome.no_price)}
          </span>
        </Link>
      </div>
    </div>
  );
}

// Binary market display (single Yes/No market)
// In Kalshi: yes_price + no_price should roughly equal 100¢ (the difference is spread)
function BinaryMarket({ outcome }: { outcome: MarketOutcome }) {
  // Calculate normalized probabilities (in case yes + no > 100 due to spread)
  const total = outcome.yes_price + outcome.no_price;
  const normalizedYes = total > 0 ? Math.round((outcome.yes_price / total) * 100) : outcome.probability;
  const normalizedNo = total > 0 ? Math.round((outcome.no_price / total) * 100) : 100 - outcome.probability;
  
  return (
    <Link
      href={`/market/${outcome.ticker}`}
      className="block"
    >
      <div className="flex items-center justify-center gap-8 py-4">
        {/* Yes side */}
        <div className="flex flex-col items-center">
          <span className="mb-1 rounded bg-emerald-600/90 px-4 py-2 transition hover:bg-emerald-600">
            <span className="text-xs font-medium text-emerald-100">Yes </span>
            <span className="font-mono text-lg font-bold text-white">
              {formatPrice(outcome.yes_price)}
            </span>
          </span>
          <span className="mt-2 font-mono text-2xl font-bold text-emerald-300">
            {normalizedYes}%
          </span>
        </div>
        
        {/* Divider */}
        <div className="h-16 w-px bg-border/40" />
        
        {/* No side */}
        <div className="flex flex-col items-center">
          <span className="mb-1 rounded bg-rose-600/90 px-4 py-2 transition hover:bg-rose-600">
            <span className="text-xs font-medium text-rose-100">No </span>
            <span className="font-mono text-lg font-bold text-white">
              {formatPrice(outcome.no_price)}
            </span>
          </span>
          <span className="mt-2 font-mono text-2xl font-bold text-rose-400">
            {normalizedNo}%
          </span>
        </div>
      </div>
      
      {/* Illiquid warning */}
      {outcome.is_illiquid && (
        <div className="mt-2 rounded bg-yellow-500/10 px-2 py-1 text-center text-xs text-yellow-400">
          Wide spread - Low liquidity
        </div>
      )}
    </Link>
  );
}

export default function EventCard({ event }: { event: GroupedEvent }) {
  return (
    <Card className="h-full border-border/40 bg-neutral-950/90 shadow-lg transition hover:border-emerald-500/40">
      <CardHeader className="pb-2">
        {/* Category badge */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] uppercase tracking-wider"
          >
            {event.category ?? "Market"}
          </Badge>
          <span className="text-[10px] text-muted-foreground font-mono">
            {event.event_ticker.slice(0, 20)}
          </span>
        </div>
        
        {/* Event title */}
        <CardTitle className="mt-2 line-clamp-2 text-base font-semibold text-white leading-tight">
          {event.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2 pt-0">
        {/* Binary market (single outcome with Yes/No) */}
        {event.is_binary && event.outcomes.length === 1 ? (
          <BinaryMarket outcome={event.outcomes[0]} />
        ) : (
          /* Multi-outcome market (multiple options) */
          <div className="space-y-1.5">
            {event.outcomes.slice(0, 4).map((outcome) => (
              <OutcomeRow key={outcome.ticker} outcome={outcome} />
            ))}
            
            {/* Show more indicator */}
            {event.outcomes.length > 4 && (
              <Link
                href={`/market/${event.outcomes[0].ticker}`}
                className="block rounded bg-black/30 py-1.5 text-center text-xs text-muted-foreground hover:text-emerald-300"
              >
                {event.outcomes.length - 4} more
              </Link>
            )}
          </div>
        )}
        
        {/* Stats row */}
        <div className="flex items-center justify-between border-t border-border/20 pt-2 text-xs text-muted-foreground">
          <div>
            <span className="font-mono text-foreground">{formatVolume(event.total_volume)}</span>
            <span> vol</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
