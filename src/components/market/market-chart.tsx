"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

type Candlestick = {
  ts: number;
  close: number | null;
};

type Annotation = { timestamp: number; label: string };

function formatTime(value: number) {
  const date = new Date(value * 1000);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function MarketChart({
  candlesticks,
  annotations,
}: {
  candlesticks: Candlestick[];
  annotations?: Annotation[];
}) {
  const data = candlesticks
    .filter((item) => item.close !== null)
    .map((item) => ({
      time: item.ts,
      price: item.close,
    }));

  return (
    <div className="h-80 w-full rounded-xl border border-border/60 bg-black/40 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={(value) => formatTime(value)}
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}¢`}
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
              const formatted =
                typeof value === "number"
                  ? `${value}¢`
                  : value !== undefined && value !== null
                    ? `${value}¢`
                    : "--";
              return [formatted, "Close"];
            }}
            labelFormatter={(label) => formatTime(label as number)}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#34d399"
            strokeWidth={2}
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
