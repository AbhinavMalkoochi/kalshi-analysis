"use client";

import { useState, useCallback } from "react";
import MarketChart from "./market-chart";
import ChatPanel from "./chat-panel";
import type { ChartPoint } from "@/lib/kalshi";

export type ChartAnnotation = {
    timestamp: number;
    label: string;
    explanation: string;
};

type MarketAnalysisProps = {
    chartData: ChartPoint[];
    currentPrice?: number;
    chatContext: {
        marketTicker: string;
        marketTitle?: string;
        eventTitle?: string;
        category?: string;
        rules?: string;
        chartData?: ChartPoint[];
        markets?: Array<{
            name: string;
            chance: number | null;
            yes_ask: number | null;
            no_ask: number | null;
        }>;
    };
};

export default function MarketAnalysis({
    chartData,
    currentPrice,
    chatContext,
}: MarketAnalysisProps) {
    const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);

    const handleAnnotation = useCallback((annotation: ChartAnnotation) => {
        setAnnotations((prev) => {
            // Avoid duplicates based on timestamp
            if (prev.some((a) => a.timestamp === annotation.timestamp)) {
                return prev;
            }
            return [...prev, annotation];
        });
    }, []);

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_450px]">
            {/* Left column: Chart */}
            <div className="space-y-6">
                <MarketChart
                    chartData={chartData}
                    currentPrice={currentPrice}
                    annotations={annotations}
                />
            </div>

            {/* Right column: Chat */}
            <div className="lg:sticky lg:top-6 lg:self-start">
                <ChatPanel
                    context={{
                        ...chatContext,
                        onAnnotation: handleAnnotation,
                    }}
                />
            </div>
        </div>
    );
}
