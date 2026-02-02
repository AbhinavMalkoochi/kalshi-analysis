import { v } from "convex/values";
import { action } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { callModel } from "./lib/llm";
import { webSearch } from "./lib/search";

export const sendMessage = action({
  args: {
    marketTicker: v.string(),
    provider: v.union(v.literal("openai"), v.literal("anthropic"), v.literal("gemini")),
    model: v.string(),
    apiKey: v.string(),
    webSearchEnabled: v.boolean(),
    context: v.any(),
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);

    const searchResults = args.webSearchEnabled
      ? await webSearch(`${args.marketTicker} market latest news`) : [];

    const system =
      "You are a market intelligence assistant. Use the provided context (rules, price history, odds) " +
      "to answer succinctly, with clear reasoning. If web search is provided, cite it in a short bullets section.";

    const prompt =
      `Context JSON: ${JSON.stringify(args.context)}\n` +
      `Search Results JSON: ${JSON.stringify(searchResults)}\n` +
      `Conversation: ${JSON.stringify(args.messages)}\n` +
      "Respond with a concise answer and then a short bullets list of sources (title + url) if any.";

    const response = await callModel({
      provider: args.provider,
      model: args.model,
      apiKey: args.apiKey,
      system,
      prompt,
    });

    return {
      reply: response.text,
      sources: searchResults,
    };
  },
});
