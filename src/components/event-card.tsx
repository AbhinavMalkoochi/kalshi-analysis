"use client";

import Link from "next/link";
import type { GroupedEvent, MarketOutcome } from "@/lib/kalshi";

function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${Math.round(value)}¢`;
}

function formatVolume(value: number | null): string {
  if (value === null || value === undefined) return "--";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
}

function OutcomeRow({ outcome }: { outcome: MarketOutcome }) {
  const displayProbability = outcome.chance !== null ? `${outcome.chance}%` : "—";
  const yesAsk = outcome.quote.yes_ask;
  const noAsk = outcome.quote.no_ask;
  const hasWideSpread = outcome.quote.has_wide_spread;

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-gray-700/50 bg-gray-800/50 px-3 py-2">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="font-medium text-gray-100 truncate">
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
      <div className="flex items-center gap-2 shrink-0">
        <span className="rounded bg-emerald-600/30 px-2.5 py-1">
          <span className="text-xs text-emerald-200">Yes </span>
          <span className="font-mono text-sm font-semibold text-white">
            {formatPrice(yesAsk)}
          </span>
        </span>
        <span className="rounded bg-rose-600/30 px-2.5 py-1">
          <span className="text-xs text-rose-200">No </span>
          <span className="font-mono text-sm font-semibold text-white">
            {formatPrice(noAsk)}
          </span>
        </span>
      </div>
    </div>
  );
}

function BinaryMarket({ outcome }: { outcome: MarketOutcome }) {
  const yesAsk = outcome.quote.yes_ask;
  const noAsk = outcome.quote.no_ask;
  const displayProbability = outcome.chance !== null ? `${outcome.chance}%` : "—";

  return (
    <div className="py-3">
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
          <span className="rounded bg-emerald-600/30 px-3 py-1.5">
            <span className="text-xs text-emerald-200">Yes </span>
            <span className="font-mono text-lg font-bold text-white">
              {formatPrice(yesAsk)}
            </span>
          </span>
          <span className="rounded bg-rose-600/30 px-3 py-1.5">
            <span className="text-xs text-rose-200">No </span>
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
  return (
    <Link href={`/market/${event.event_ticker}`} className="block h-full">
      <div className="h-full rounded-lg border border-gray-700/80 bg-gray-900/90 p-4 shadow-lg transition hover:border-emerald-500/50 hover:shadow-emerald-500/5 cursor-pointer">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 uppercase tracking-wider">
            {event.category ?? "Market"}
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            {event.event_ticker.slice(0, 20)}
          </span>
        </div>

        {/* Event title */}
        <h3 className="mb-3 line-clamp-2 text-base font-semibold text-white leading-tight">
          {event.title}
        </h3>

        {/* Markets */}
        {event.is_binary && event.outcomes.length === 1 ? (
          <BinaryMarket outcome={event.outcomes[0]} />
        ) : (
          <div className="space-y-1.5">
            {event.outcomes.slice(0, 4).map((outcome) => (
              <OutcomeRow key={outcome.ticker} outcome={outcome} />
            ))}
            {event.outcomes.length > 4 && (
              <div className="rounded bg-gray-800/50 py-1.5 text-center text-xs text-gray-400">
                +{event.outcomes.length - 4} more options
              </div>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-700/50 pt-3 text-xs text-gray-400">
          <div>
            <span className="font-mono text-gray-200">{formatVolume(event.total_volume)}</span>
            <span> vol</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
