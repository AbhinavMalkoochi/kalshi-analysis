"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import Link from "next/link";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <div className="rounded-lg border border-gray-700/80 bg-gray-900/90 shadow-lg ring-1 ring-emerald-500/20">
      {/* Prominent header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-emerald-500" />
          <div>
            <h3 className="font-medium text-emerald-300">AI Analysis</h3>
            <p className="text-xs text-gray-400">Ask about odds, rules, or dynamics</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSummarize}
          disabled={isLoading}
          className="rounded-md bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50 transition-colors"
        >
          ✨ Summarize
        </button>
      </div>

      {/* Messages area - taller for prominence */}
      <div className="h-80 space-y-3 overflow-y-auto p-4 text-sm">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
            <svg className="mb-3 h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="mb-2 text-sm">AI has context on:</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Current prices and odds</li>
              <li>• Market rules & settlement</li>
              <li>• All {context.markets?.length ?? 0} options</li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              Click <span className="text-emerald-400">Summarize</span> or ask a question
            </p>
          </div>
        ) : null}

        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <p className={`text-xs font-medium ${message.role === "user" ? "text-emerald-400" : "text-gray-400"}`}>
              {message.role === "user" ? "You" : "AI"}
            </p>
            <div className={`rounded-lg px-3 py-2 ${message.role === "user" ? "bg-gray-800" : "bg-gray-800/50"}`}>
              <div className="text-gray-200 whitespace-pre-wrap">
                {message.parts?.map((part, i) => {
                  if (part.type === "text") {
                    return <span key={i}>{part.text}</span>;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-300">Analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="border-t border-gray-700/50 px-4 py-2">
          <p className="text-xs text-rose-400">
            {error.message || "An error occurred. Please try again."}
          </p>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-700/50 p-4">
        {!isAuthenticated && !hasApiKey ? (
          <div className="text-center text-sm">
            <p className="mb-2 text-gray-400">Add your OpenAI API key to chat</p>
            <Link href="/settings" className="text-emerald-400 hover:text-emerald-300">
              Go to Settings →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this market..."
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
