"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GroupedEvent, MarketOutcome } from "@/lib/kalshi";

// Format price in cents
function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${Math.round(value)}¢`;
}

// Format volume with K/M suffixes
function formatVolume(value: number | null) {
  if (value === null || value === undefined) return "--";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
}

// Single outcome row - just displaying data, no individual links
function OutcomeRow({ outcome }: { outcome: MarketOutcome }) {
  const displayProbability = outcome.chance !== null ? `${outcome.chance}%` : "—";
  const yesAsk = outcome.quote.yes_ask;
  const noAsk = outcome.quote.no_ask;
  const hasWideSpread = outcome.quote.has_wide_spread;

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border/20 bg-black/20 px-3 py-2">
      {/* Outcome name and probability */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="font-medium text-foreground truncate">
          {outcome.name}
        </span>

        <span className="font-mono text-lg font-semibold text-white">
          {displayProbability}
        </span>

        {hasWideSpread && (
          <span className="shrink-0 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-400">
            Low Vol
          </span>
        )}
      </div>

      {/* Prices display - read only, no trading */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1.5 rounded bg-emerald-600/30 px-3 py-1.5">
          <span className="text-xs font-medium text-emerald-100">Yes</span>
          <span className="font-mono text-sm font-semibold text-white">
            {formatPrice(yesAsk)}
          </span>
        </span>

        <span className="flex items-center gap-1.5 rounded bg-rose-600/30 px-3 py-1.5">
          <span className="text-xs font-medium text-rose-100">No</span>
          <span className="font-mono text-sm font-semibold text-white">
            {formatPrice(noAsk)}
          </span>
        </span>
      </div>
    </div>
  );
}

// Binary market display (single Yes/No market)
function BinaryMarket({ outcome }: { outcome: MarketOutcome }) {
  const yesAsk = outcome.quote.yes_ask;
  const noAsk = outcome.quote.no_ask;
  const displayProbability = outcome.chance !== null ? `${outcome.chance}%` : "—";

  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-white">{displayProbability}</span>
          {outcome.quote.has_wide_spread && (
            <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-[10px] text-yellow-400">
              Wide spread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-600/30 px-4 py-2">
            <span className="text-xs font-medium text-emerald-100">Yes </span>
            <span className="font-mono text-lg font-bold text-white">
              {formatPrice(yesAsk)}
            </span>
          </span>
          <span className="rounded bg-rose-600/30 px-4 py-2">
            <span className="text-xs font-medium text-rose-100">No </span>
            <span className="font-mono text-lg font-bold text-white">
              {formatPrice(noAsk)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EventCard({ event }: { event: GroupedEvent }) {
  // Clicking the entire card navigates to the event page
  return (
    <Link href={`/market/${event.event_ticker}`} className="block h-full">
      <Card className="h-full border-border/40 bg-neutral-950/90 shadow-lg transition hover:border-emerald-500/40 cursor-pointer">
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
                <div className="rounded bg-black/30 py-1.5 text-center text-xs text-muted-foreground">
                  +{event.outcomes.length - 4} more options
                </div>
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
    </Link>
  );
}
