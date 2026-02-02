import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { requireUserId } from "./lib/auth";
import { getMarket, getMarketCandlesticks, getOrderbook } from "./lib/kalshi";
import { callModel } from "./lib/llm";
import { webSearch } from "./lib/search";

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const generateReport = action({
  args: {
    marketTicker: v.string(),
    provider: v.union(v.literal("openai"), v.literal("anthropic"), v.literal("gemini")),
    model: v.string(),
    apiKey: v.string(),
    webSearchEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const market = await getMarket(args.marketTicker);

    if (!market.series_ticker) {
      throw new Error("Market is missing series ticker");
    }

    const now = Math.floor(Date.now() / 1000);
    const start = now - 60 * 60 * 24 * 30;
    const candlesticks = await getMarketCandlesticks({
      seriesTicker: market.series_ticker,
      ticker: args.marketTicker,
      startTs: start,
      endTs: now,
      periodInterval: 60,
    });

    const orderbook = await getOrderbook(args.marketTicker);

    const searchResults = args.webSearchEnabled
      ? await webSearch(`${market.title} market news analysis`) : [];

    const context = {
      market,
      orderbook,
      candlesticks,
      searchResults,
    };

    const system =
      "Act as a senior financial analyst. Review the market rules and price history. " +
      "Identify the overall trend (bullish/bearish/stable), significant turning points (if any), " +
      "and the current market sentiment. Correlate these movements with real-world news events by " +
      "performing a web search if necessary. Do not force a volatility analysis if the market is stable.";

    const prompt =
      "Analyze the market using the provided JSON context. Return a JSON object with keys: " +
      "summary (string), trend (string), sentiment (string), annotations (array of {timestamp:number,label:string}), " +
      "news (array of {title:string,url:string,reason:string}). Use Unix timestamps in seconds for annotations. " +
      "Context JSON: " +
      JSON.stringify(context);

    const response = await callModel({
      provider: args.provider,
      model: args.model,
      apiKey: args.apiKey,
      system,
      prompt,
    });

    const parsed = safeJsonParse(response.text);
    const report = parsed ?? {
      summary: response.text,
      trend: "unknown",
      sentiment: "unknown",
      annotations: [],
      news: searchResults.map((item) => ({
        title: item.title,
        url: item.url,
        reason: item.snippet,
      })),
    };

    await ctx.runMutation(api.analysis.store, {
      userId,
      marketTicker: args.marketTicker,
      provider: args.provider,
      model: args.model,
      report,
    });

    return report;
  },
});

export const store = mutation({
  args: {
    userId: v.string(),
    marketTicker: v.string(),
    provider: v.string(),
    model: v.string(),
    report: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("analysisReports", {
      userId: args.userId,
      marketTicker: args.marketTicker,
      provider: args.provider,
      model: args.model,
      report: args.report,
      createdAt: Date.now(),
    });
  },
});
