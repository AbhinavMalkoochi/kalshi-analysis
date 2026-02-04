import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, context, apiKey }: { 
    messages: UIMessage[];
    context?: {
      marketTicker?: string;
      marketTitle?: string;
      rules?: string;
      eventTitle?: string;
      category?: string;
      markets?: Array<{
        name: string;
        chance: number | null;
        yes_ask: number | null;
        no_ask: number | null;
      }>;
    };
    apiKey?: string;
  } = await req.json();

  // Build system prompt with market context
  let systemPrompt = `You are a helpful market analyst assistant for a prediction market analysis platform. 
You help users understand market dynamics, interpret odds, and provide insights.

Your response style:
- Be concise and direct
- Use data when available
- Explain probability concepts simply
- Never provide financial advice or encourage trading
- This platform is for ANALYSIS ONLY, not trading

`;

  if (context) {
    systemPrompt += `\n\n## Current Market Context\n`;
    
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
    
    if (context.rules) {
      systemPrompt += `\n**Market Rules/Contract:**\n${context.rules}\n`;
    }
  }

  // Use provided API key or fall back to environment variable
  const openai = createOpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY,
  });

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
