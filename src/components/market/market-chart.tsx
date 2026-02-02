"use client";

import { useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
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

type Annotation = { timestamp: number; label: string };

function formatTime(value: number) {
  const date = new Date(value * 1000);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatTimeTooltip(value: number) {
  const date = new Date(value * 1000);
  return date.toLocaleDateString(undefined, { 
    month: "short", 
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export default function MarketChart({
  candlesticks,
  annotations,
  currentPrice,
}: {
  candlesticks: Candlestick[];
  annotations?: Annotation[];
  currentPrice?: number;
}) {
  // Use useSyncExternalStore to track mounted state without triggering the lint warning
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const data = candlesticks
    .filter((item) => item.close !== null)
    .map((item) => ({
      time: item.ts,
      price: item.close,
    }));
  
  // If no data, show placeholder with current price indicator
  if (data.length === 0) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center rounded-xl border border-border/60 bg-black/40 p-4">
        <span className="text-muted-foreground mb-2">No price history available</span>
        {currentPrice !== undefined && (
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Current price: </span>
            <span className="font-mono text-lg font-semibold text-emerald-300">{currentPrice}¢</span>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground/60 max-w-xs text-center">
          Price history is available for markets with trading activity. New markets may not have historical data yet.
        </p>
      </div>
    );
  }
  
  // Don't render until mounted (fixes hydration/dimension issues)
  if (!mounted) {
    return (
      <div className="h-80 w-full rounded-xl border border-border/60 bg-black/40 animate-pulse" />
    );
  }

  // Calculate price range for Y-axis
  const prices = data.map(d => d.price as number);
  const minPrice = Math.max(0, Math.min(...prices) - 5);
  const maxPrice = Math.min(100, Math.max(...prices) + 5);
  
  // Get latest price for display
  const latestPrice = data.length > 0 ? data[data.length - 1].price : currentPrice;
  
  // Calculate price change
  const firstPrice = data.length > 0 ? data[0].price : null;
  const priceChange = firstPrice && latestPrice ? (latestPrice as number) - (firstPrice as number) : 0;
  const priceChangePercent = firstPrice ? ((priceChange / (firstPrice as number)) * 100).toFixed(1) : "0";
  const isPositive = priceChange >= 0;

  return (
    <div className="h-80 w-full rounded-xl border border-border/60 bg-black/40 p-4">
      {/* Chart header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-muted-foreground">YES Price</span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-white">{latestPrice}¢</span>
              <span className={`text-sm font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                {isPositive ? "+" : ""}{priceChange.toFixed(0)}¢ ({isPositive ? "+" : ""}{priceChangePercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
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
            tickFormatter={(value) => `${value}¢`}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#0b0f14",
              border: "1px solid rgba(16,185,129,0.4)",
              borderRadius: 8,
              color: "#e5e7eb",
              fontSize: 12,
            }}
            formatter={(value) => {
              const formatted = typeof value === "number" ? `${value}¢` : "--";
              return [formatted, "Yes Price"];
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
          {annotations?.map((annotation) => (
            <ReferenceLine
              key={annotation.timestamp}
              x={annotation.timestamp}
              stroke="#fbbf24"
              strokeDasharray="4 4"
              label={{
                value: annotation.label,
                position: "insideTop",
                fill: "#fbbf24",
                fontSize: 10,
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
