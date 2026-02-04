"use client";

import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ReferenceDot,
  ReferenceLine,
} from "recharts";
import type { ChartAnnotation } from "./market-analysis";

type ChartPoint = {
  ts: number;
  price: number;
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
  chartData,
  currentPrice,
  annotations = [],
}: {
  chartData: ChartPoint[];
  currentPrice?: number;
  annotations?: ChartAnnotation[];
}) {
  const data = chartData.map((item) => ({
    time: item.ts,
    price: item.price,
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

  const prices = data.map(d => d.price);
  const minPrice = Math.max(0, Math.min(...prices) - 5);
  const maxPrice = Math.min(100, Math.max(...prices) + 5);

  const latestPrice = data[data.length - 1].price;
  const firstPrice = data[0].price;
  const priceChange = latestPrice - firstPrice;
  const priceChangePercent = firstPrice > 0 ? ((priceChange / firstPrice) * 100).toFixed(1) : "0";
  const isPositive = priceChange >= 0;

  const timeRanges: TimeRange[] = ["6H", "1D", "1W", "1M", "ALL"];

  // Find price at annotation timestamp
  const getAnnotationPrice = (timestamp: number): number | null => {
    // Find closest data point
    let closest = data[0];
    let minDiff = Math.abs(data[0].time - timestamp);
    for (const point of data) {
      const diff = Math.abs(point.time - timestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }
    return closest?.price ?? null;
  };

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

      {/* Annotations legend */}
      {annotations.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {annotations.map((annotation, idx) => (
            <div
              key={annotation.timestamp}
              className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-amber-300">{annotation.label}</span>
            </div>
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={280}>
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

          {/* Render annotation markers */}
          {annotations.map((annotation) => {
            const price = getAnnotationPrice(annotation.timestamp);
            if (price === null) return null;

            return (
              <ReferenceDot
                key={annotation.timestamp}
                x={annotation.timestamp}
                y={price}
                r={6}
                fill="#fbbf24"
                stroke="#1f2937"
                strokeWidth={2}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>

      {/* Annotation explanations */}
      {annotations.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-gray-700/50 pt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">AI Insights</p>
          {annotations.map((annotation) => (
            <div key={annotation.timestamp} className="flex gap-2 text-sm">
              <span className="shrink-0 h-2 w-2 mt-1.5 rounded-full bg-amber-400" />
              <div>
                <span className="font-medium text-amber-300">{annotation.label}:</span>{" "}
                <span className="text-gray-300">{annotation.explanation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
