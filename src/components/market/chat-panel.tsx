"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle form submission
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input });
      setInput("");
    }
  }

  // Summarize button handler
  function handleSummarize() {
    const summaryPrompt = "Give me a brief summary of this market: what it's about, current odds, and key factors to consider.";
    sendMessage({ text: summaryPrompt });
  }

  const hasApiKey = Boolean(apiKey || process.env.NEXT_PUBLIC_HAS_OPENAI_KEY);

  return (
    <Card className="border-border/60 bg-black/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-emerald-200">Market Analysis</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSummarize}
            disabled={isLoading}
            className="text-xs text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10"
          >
            ✨ Summarize
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Ask about odds, rules, or market dynamics.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Messages area */}
        <div className="h-64 space-y-3 overflow-y-auto rounded-lg border border-border/60 bg-black/60 p-3 text-sm">
          {messages.length === 0 ? (
            <div className="space-y-2 text-muted-foreground">
              <p>Ask anything about this market. The AI has context about:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Current prices and odds</li>
                <li>Market rules and settlement criteria</li>
                <li>All available options</li>
              </ul>
              <p className="text-xs">Click &quot;Summarize&quot; for a quick overview.</p>
            </div>
          ) : null}

          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {message.role === "user" ? "You" : "AI"}
              </p>
              <div className="text-foreground whitespace-pre-wrap">
                {message.parts?.map((part, i) => {
                  if (part.type === "text") {
                    return <span key={i}>{part.text}</span>;
                  }
                  return null;
                })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-emerald-300">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs">Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error display */}
        {error && (
          <p className="text-xs text-rose-300">
            {error.message || "An error occurred. Please try again."}
          </p>
        )}

        {/* Auth check */}
        {!isAuthenticated && !hasApiKey ? (
          <div className="rounded-lg border border-border/60 bg-black/30 p-3 text-center text-sm">
            <p className="text-muted-foreground mb-2">Sign in and add your OpenAI API key to chat.</p>
            <Button asChild variant="ghost" size="sm" className="text-emerald-200">
              <Link href="/settings">Go to Settings</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this market..."
              className="flex-1 rounded-lg border border-border/60 bg-black/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50 focus:outline-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-emerald-400 text-black hover:bg-emerald-300 px-4"
            >
              Send
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
