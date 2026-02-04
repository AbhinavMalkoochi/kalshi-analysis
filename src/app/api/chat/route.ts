import {
  type InferUITools,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
  convertToModelMessages,
  streamText,
  tool,
  stepCountIs,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

export const maxDuration = 60;

// Define tools for the AI agent
const tools = {
  annotateChart: tool({
    description: "Add an annotation to the price chart to highlight a significant price movement or event. Use this when explaining price spikes, drops, or notable patterns.",
    inputSchema: z.object({
      timestamp: z.number().describe("Unix timestamp in seconds for the chart point to annotate"),
      label: z.string().describe("Short label for the annotation (e.g., 'News Impact', 'Volume Spike')"),
      explanation: z.string().describe("Detailed explanation of what caused this price movement"),
    }),
    execute: async ({ timestamp, label, explanation }) => {
      return { timestamp, label, explanation, success: true };
    },
  }),
  
  webSearch: tool({
    description: "Search the web for recent news and information about this market. Use this tool when the user asks about recent events, news, or wants current information.",
    inputSchema: z.object({
      query: z.string().describe("The search query for finding relevant market news"),
    }),
    execute: async ({ query }) => {
      // Simple web search using DuckDuckGo instant answers (no API key needed)
      try {
        const response = await fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
        );
        const data = await response.json() as {
          AbstractText?: string;
          AbstractSource?: string;
          AbstractURL?: string;
          RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
        };
        
        const results = [];
        if (data.AbstractText) {
          results.push({
            title: data.AbstractSource || "Summary",
            snippet: data.AbstractText,
            url: data.AbstractURL || "",
          });
        }
        
        // Add related topics
        for (const topic of (data.RelatedTopics || []).slice(0, 3)) {
          if (topic.Text) {
            results.push({
              title: topic.Text.slice(0, 50) + "...",
              snippet: topic.Text,
              url: topic.FirstURL || "",
            });
          }
        }
        
        return results.length > 0 ? results : [{ title: "No results", snippet: "No relevant information found.", url: "" }];
      } catch {
        return [{ title: "Search unavailable", snippet: "Web search is currently unavailable.", url: "" }];
      }
    },
  }),

  getPriceAtTime: tool({
    description: "Get the exact price at a specific point in time from the chart data. Use this to reference specific historical prices when analyzing the market.",
    inputSchema: z.object({
      timestamp: z.number().describe("Unix timestamp in seconds to get the price for"),
    }),
    // This is a client-side tool - execution happens on the client
  }),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const { messages, context, apiKey, enableWebSearch }: { 
    messages: ChatMessage[];
    context?: {
      marketTicker?: string;
      marketTitle?: string;
      rules?: string;
      eventTitle?: string;
      category?: string;
      chartData?: Array<{ ts: number; price: number }>;
      markets?: Array<{
        name: string;
        chance: number | null;
        yes_ask: number | null;
        no_ask: number | null;
      }>;
    };
    apiKey?: string;
    enableWebSearch?: boolean;
  } = await req.json();

  // Build system prompt with market context
  let systemPrompt = `You are an expert market analyst assistant for a prediction market analysis platform.
You have access to tools to enhance your analysis:
- Use annotateChart to highlight important price movements on the chart
- Use webSearch to find recent news (only if the user asks or if it would significantly help)
- Use getPriceAtTime to reference specific historical prices

Your response style:
- Format responses using markdown (headers, bold, lists)
- Be concise and data-driven
- When annotating charts, explain the reasoning
- Never provide financial advice or encourage trading
- This platform is for ANALYSIS ONLY

`;

  if (context) {
    systemPrompt += `\n## Current Market Context\n`;
    
    if (context.marketTitle || context.eventTitle) {
      systemPrompt += `**Market:** ${context.eventTitle || context.marketTitle}\n`;
    }
    
    if (context.category) {
      systemPrompt += `**Category:** ${context.category}\n`;
    }
    
    if (context.marketTicker) {
      systemPrompt += `**Ticker:** ${context.marketTicker}\n`;
    }
    
    if (context.markets && context.markets.length > 0) {
      systemPrompt += `\n**Available Options:**\n`;
      for (const m of context.markets) {
        const chance = m.chance !== null ? `${m.chance}%` : "N/A";
        const yesPrice = m.yes_ask !== null ? `${m.yes_ask}¢` : "N/A";
        const noPrice = m.no_ask !== null ? `${m.no_ask}¢` : "N/A";
        systemPrompt += `- ${m.name}: ${chance} (Yes: ${yesPrice}, No: ${noPrice})\n`;
      }
    }
    
    if (context.chartData && context.chartData.length > 0) {
      const prices = context.chartData.map(d => d.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const latestPrice = context.chartData[context.chartData.length - 1]?.price;
      const firstPrice = context.chartData[0]?.price;
      systemPrompt += `\n**Price History Summary:**\n`;
      systemPrompt += `- Current: ${latestPrice}¢\n`;
      systemPrompt += `- Range: ${minPrice}¢ - ${maxPrice}¢\n`;
      systemPrompt += `- Change: ${latestPrice && firstPrice ? (latestPrice - firstPrice > 0 ? "+" : "") + (latestPrice - firstPrice) : 0}¢\n`;
      systemPrompt += `- Data points: ${context.chartData.length}\n`;
    }
    
    if (context.rules) {
      systemPrompt += `\n**Market Rules/Contract:**\n${context.rules}\n`;
    }
  }

  // Add web search instruction based on toggle
  if (!enableWebSearch) {
    systemPrompt += `\n**Note:** Web search is disabled for this query. Do not use the webSearch tool.\n`;
  }

  const openai = createOpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY,
  });

  // Filter tools based on web search toggle
  const activeTools = enableWebSearch 
    ? tools 
    : { annotateChart: tools.annotateChart, getPriceAtTime: tools.getPriceAtTime };

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: activeTools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
