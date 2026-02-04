"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarketContext = {
  marketTicker: string;
  marketTitle?: string;
  eventTitle?: string;
  category?: string;
  rules?: string;
  markets?: Array<{
    name: string;
    chance: number | null;
    yes_ask: number | null;
    no_ask: number | null;
  }>;
};

export default function ChatPanel({ context }: { context: MarketContext }) {
  const { isAuthenticated, settings } = useSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const apiKey = settings?.encryptedKeys?.openai;

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        context: {
          marketTicker: context.marketTicker,
          marketTitle: context.marketTitle,
          eventTitle: context.eventTitle,
          category: context.category,
          rules: context.rules,
          markets: context.markets,
        },
        apiKey,
      },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input });
      setInput("");
    }
  }

  function handleSummarize() {
    const summaryPrompt = "Give me a brief summary of this market: what it's about, current odds, and key factors to consider.";
    sendMessage({ text: summaryPrompt });
  }

  const hasApiKey = Boolean(apiKey || process.env.NEXT_PUBLIC_HAS_OPENAI_KEY);
  const showAuthPrompt = !isAuthenticated && !hasApiKey;

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
          disabled={isLoading || showAuthPrompt}
          className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50 transition-colors"
        >
          Summarize
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="min-h-[400px] max-h-[600px] overflow-y-auto p-5 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center text-gray-400">
            <svg className="mb-4 h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="mb-3 text-sm font-medium">AI has context on:</p>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>Current prices and odds</li>
              <li>Market rules and settlement</li>
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
              <div className="prose prose-sm prose-invert max-w-none">
                {message.parts?.map((part, i) => {
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
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
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
        {showAuthPrompt ? (
          <div className="text-center text-sm">
            <p className="mb-2 text-gray-400">Add your OpenAI API key to chat</p>
            <Link href="/settings" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Go to Settings
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this market..."
              className="flex-1 rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
