"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_MODEL, DEFAULT_PROVIDER, MODELS, Provider } from "@/lib/models";
import { useSettings } from "@/hooks/use-settings";
import Link from "next/link";

const LOADING_STEPS = [
  "Reading market rules...",
  "Analyzing price history...",
  "Searching recent news...",
  "Synthesizing report...",
];

export type AnalysisReport = {
  summary: string;
  trend?: string;
  sentiment?: string;
  annotations?: Array<{ timestamp: number; label: string }>;
  news?: Array<{ title: string; url: string; reason: string }>;
};

export default function AnalysisPanel({
  marketTicker,
  onReport,
}: {
  marketTicker: string;
  onReport?: (report: AnalysisReport) => void;
}) {
  const { isAuthenticated, settings } = useSettings();
  const generateReport = useAction(api.analysis.generateReport);
  const provider =
    (settings?.preferences.defaultProvider as Provider) ?? DEFAULT_PROVIDER;
  const model = settings?.preferences.defaultModel ?? DEFAULT_MODEL;
  const webSearch = settings?.preferences.webSearchEnabled ?? true;
  const [status, setStatus] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);


  async function handleGenerate() {
    setError(null);
    setReport(null);

    if (!isAuthenticated) {
      setError("Sign in to generate an AI report.");
      return;
    }

    const apiKey = settings?.encryptedKeys?.[provider];
    if (!apiKey) {
      setError("No API key saved for this provider. Add it in Settings.");
      return;
    }

    const steps = [...LOADING_STEPS];
    setStatus(steps[0]);
    steps.slice(1).forEach((step, index) => {
      setTimeout(() => setStatus(step), 800 * (index + 1));
    });

    try {
      const result = (await generateReport({
        marketTicker,
        provider,
        model,
        apiKey,
        webSearchEnabled: webSearch,
      })) as AnalysisReport;
      setReport(result);
      onReport?.(result);
      setStatus(null);
    } catch (err) {
      setStatus(null);
      setError(err instanceof Error ? err.message : "Failed to generate report.");
    }
  }

  return (
    <Card className="border-border/60 bg-black/40">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-sm text-emerald-200">AI Report</CardTitle>
          <p className="text-xs text-muted-foreground">On-demand analysis for this market.</p>
        </div>
        <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
          {provider}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-black/30 px-3 py-2">
          <div className="space-y-0.5">
            <p className="text-sm text-foreground">Provider</p>
            <p className="text-xs text-muted-foreground">{provider}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm text-foreground">Model</p>
            <p className="text-xs text-muted-foreground">
              {MODELS[provider].find((item) => item.value === model)?.label ?? model}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-emerald-200 hover:text-emerald-100">
            <Link href="/settings">Manage AI Settings</Link>
          </Button>
        </div>
        <Button
          onClick={handleGenerate}
          className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
        >
          Generate AI Report
        </Button>
        {status ? (
          <p className="text-xs text-emerald-200/80">{status}</p>
        ) : null}
        {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        {report ? (
          <div className="space-y-3 rounded-lg border border-emerald-400/20 bg-black/60 p-4 text-sm">
            <p className="text-emerald-100">{report.summary}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {report.trend ? (
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
                  Trend: {report.trend}
                </Badge>
              ) : null}
              {report.sentiment ? (
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
                  Sentiment: {report.sentiment}
                </Badge>
              ) : null}
            </div>
            {report.news && report.news.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">News & Discourse</p>
                <ul className="space-y-2">
                  {report.news.map((item) => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        className="text-emerald-200 hover:text-emerald-100"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.title}
                      </a>
                      <p className="text-xs text-muted-foreground">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
