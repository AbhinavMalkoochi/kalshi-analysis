"use client";

import { useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

type Candlestick = {
  ts: number;
  close: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
};

function formatTime(value: number): string {
  const date = new Date(value * 1000);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatTimeTooltip(value: number): string {
  const date = new Date(value * 1000);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

type TimeRange = "6H" | "1D" | "1W" | "1M" | "ALL";

export default function MarketChart({
  candlesticks,
  currentPrice,
}: {
  candlesticks: Candlestick[];
  currentPrice?: number;
}) {
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  const data = candlesticks
    .filter((item) => item.close !== null)
    .map((item) => ({
      time: item.ts,
      price: item.close,
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center rounded-lg border border-gray-700/80 bg-gray-900/90 p-4">
        <svg className="mb-3 h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <span className="text-gray-400 mb-2">No price history available</span>
        {currentPrice !== undefined && (
          <div className="text-center">
            <span className="text-xs text-gray-500">Current price: </span>
            <span className="font-mono text-lg font-semibold text-emerald-400">{currentPrice}¢</span>
          </div>
        )}
        <p className="mt-4 text-xs text-gray-500 max-w-xs text-center">
          Price history shows after trading activity begins
        </p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="h-80 w-full rounded-lg border border-gray-700/80 bg-gray-900/90 animate-pulse" />
    );
  }

  const prices = data.map(d => d.price as number);
  const minPrice = Math.max(0, Math.min(...prices) - 5);
  const maxPrice = Math.min(100, Math.max(...prices) + 5);

  const latestPrice = data.length > 0 ? data[data.length - 1].price : currentPrice;
  const firstPrice = data.length > 0 ? data[0].price : null;
  const priceChange = firstPrice && latestPrice ? (latestPrice as number) - (firstPrice as number) : 0;
  const priceChangePercent = firstPrice ? ((priceChange / (firstPrice as number)) * 100).toFixed(1) : "0";
  const isPositive = priceChange >= 0;

  const timeRanges: TimeRange[] = ["6H", "1D", "1W", "1M", "ALL"];

  return (
    <div className="rounded-lg border border-gray-700/80 bg-gray-900/90 p-4 shadow-lg">
      {/* Chart header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-gray-400">Forecast</span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-white">{latestPrice}¢</span>
              <span className={`text-sm font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                {isPositive ? "▲" : "▼"} {Math.abs(priceChange).toFixed(0)}¢ ({isPositive ? "+" : ""}{priceChangePercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Time range buttons */}
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              type="button"
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${range === "ALL"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tickFormatter={(value) => formatTime(value)}
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${value}`}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
            width={35}
          />
          <Tooltip
            contentStyle={{
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: 8,
              color: "#e5e7eb",
              fontSize: 12,
            }}
            formatter={(value) => {
              const formatted = typeof value === "number" ? `${value}¢` : "--";
              return [formatted, "Price"];
            }}
            labelFormatter={(label) => formatTimeTooltip(label as number)}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#colorPrice)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
