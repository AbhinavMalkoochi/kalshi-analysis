"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage, type UIDataTypes } from "ai";
import { useRef, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatTools } from "@/app/api/chat/route";

type MarketContext = {
  marketTicker: string;
  marketTitle?: string;
  eventTitle?: string;
  category?: string;
  rules?: string;
  chartData?: Array<{ ts: number; price: number }>;
  markets?: Array<{
    name: string;
    chance: number | null;
    yes_ask: number | null;
    no_ask: number | null;
  }>;
  onAnnotation?: (annotation: { timestamp: number; label: string; explanation: string }) => void;
};

type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export default function ChatPanel({ context }: { context: MarketContext }) {
  const { isAuthenticated, settings, isLoading: authLoading } = useSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const apiKey = settings?.encryptedKeys?.openai;

  const { messages, sendMessage, status, error } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        context: {
          marketTicker: context.marketTicker,
          marketTitle: context.marketTitle,
          eventTitle: context.eventTitle,
          category: context.category,
          rules: context.rules,
          chartData: context.chartData,
          markets: context.markets,
        },
        apiKey,
        enableWebSearch: webSearchEnabled,
      },
    }),
  });

  const isStreaming = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Process tool outputs for annotations
  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts || []) {
        if (part.type === "tool-annotateChart" && part.state === "output-available" && context.onAnnotation) {
          const output = part.output as { timestamp: number; label: string; explanation: string };
          context.onAnnotation(output);
        }
      }
    }
  }, [messages, context]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      sendMessage({ text: input });
      setInput("");
    }
  }

  function handleSummarize() {
    const summaryPrompt = "Give me a brief summary of this market: what it's about, current odds, and key factors to consider. If there are notable price movements in the chart, annotate them.";
    sendMessage({ text: summaryPrompt });
  }

  // Only compute auth-dependent values after mount
  const hasApiKey = mounted ? Boolean(apiKey || process.env.NEXT_PUBLIC_HAS_OPENAI_KEY) : true;
  const showAuthPrompt = mounted && !authLoading && !isAuthenticated && !hasApiKey;

  return (
    <div className="flex flex-col rounded-xl border border-emerald-500/30 bg-gray-900/95 shadow-2xl shadow-emerald-500/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-1 rounded-full bg-emerald-500" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-300">AI Analysis</h3>
            <p className="text-xs text-gray-400">Ask about odds, rules, or market dynamics</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSummarize}
          disabled={isStreaming || showAuthPrompt || !mounted}
          className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50 transition-colors"
        >
          Summarize
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="min-h-[500px] max-h-[700px] overflow-y-auto p-5 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[450px] flex-col items-center justify-center text-center text-gray-400">
            <svg className="mb-4 h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="mb-3 text-sm font-medium">AI has context on:</p>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>Current prices and odds</li>
              <li>Market rules and settlement</li>
              <li>Price history chart data</li>
              <li>All {context.markets?.length ?? 0} options</li>
            </ul>
            <p className="mt-6 text-xs text-gray-500">
              Click <span className="text-emerald-400 font-medium">Summarize</span> or ask a question
            </p>
          </div>
        ) : null}

        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <p className={`text-xs font-semibold uppercase tracking-wide ${message.role === "user" ? "text-emerald-400" : "text-gray-400"}`}>
              {message.role === "user" ? "You" : "AI Analysis"}
            </p>
            <div className={`rounded-xl px-4 py-3 ${message.role === "user" ? "bg-gray-800/80" : "bg-gray-800/40 border border-gray-700/50"}`}>
              <div className="prose prose-sm prose-invert max-w-none space-y-2">
                {message.parts?.map((part, i) => {
                  // Text content
                  if (part.type === "text") {
                    return (
                      <ReactMarkdown
                        key={i}
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-4 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-semibold text-emerald-300 mt-3 mb-1">{children}</h3>,
                          p: ({ children }) => <p className="text-gray-200 leading-relaxed mb-2">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-gray-200 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-gray-200 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="text-gray-200">{children}</li>,
                          code: ({ children }) => <code className="bg-gray-700 px-1.5 py-0.5 rounded text-emerald-300 text-xs font-mono">{children}</code>,
                          pre: ({ children }) => <pre className="bg-gray-800 p-3 rounded-lg overflow-x-auto text-sm">{children}</pre>,
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    );
                  }

                  // Chart annotation tool
                  if (part.type === "tool-annotateChart") {
                    return (
                      <div key={i} className="my-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                        <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Chart Annotation</span>
                          {part.state !== "output-available" && <span className="animate-pulse">...</span>}
                        </div>
                        {part.state === "output-available" && part.output && (
                          <div className="text-sm text-gray-300">
                            <span className="font-medium text-white">{(part.output as { label: string }).label}:</span>{" "}
                            {(part.output as { explanation: string }).explanation}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Web search tool
                  if (part.type === "tool-webSearch") {
                    const results = part.state === "output-available" && part.output
                      ? (part.output as Array<{ title: string; snippet: string; url: string }>)
                      : [];

                    return (
                      <div key={i} className="my-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
                        <div className="flex items-center gap-2 text-xs text-blue-400 mb-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Web Search</span>
                          {part.state !== "output-available" && <span className="animate-pulse">Searching...</span>}
                        </div>
                        {results.length > 0 && (
                          <div className="space-y-2">
                            {results.map((result, idx) => (
                              <div key={idx} className="text-sm">
                                {result.url ? (
                                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-300 hover:underline">
                                    {result.title}
                                  </a>
                                ) : (
                                  <span className="font-medium text-gray-300">{result.title}</span>
                                )}
                                <p className="text-gray-400 text-xs mt-0.5">{result.snippet.slice(0, 150)}...</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-emerald-300">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="border-t border-gray-700/50 px-5 py-3">
          <p className="text-sm text-rose-400">
            {error.message || "An error occurred. Please try again."}
          </p>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-700/50 p-5">
        {!mounted ? (
          <div className="h-12 animate-pulse rounded-xl bg-gray-800/50" />
        ) : showAuthPrompt ? (
          <div className="text-center text-sm">
            <p className="mb-2 text-gray-400">Add your OpenAI API key to chat</p>
            <Link href="/settings" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Go to Settings
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this market..."
                className="flex-1 rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </form>

            {/* Web search toggle */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${webSearchEnabled
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-gray-800 text-gray-400 hover:text-gray-300"
                  }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Web Search {webSearchEnabled ? "On" : "Off"}
              </button>
              <span className="text-xs text-gray-500">
                {webSearchEnabled ? "AI will search for recent news" : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
