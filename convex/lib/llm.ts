type Provider = "openai" | "anthropic" | "gemini";

type LlmResponse = {
  text: string;
  raw?: unknown;
};

export async function callModel(args: {
  provider: Provider;
  model: string;
  apiKey: string;
  system: string;
  prompt: string;
}): Promise<LlmResponse> {
  if (args.provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: args.model,
        messages: [
          { role: "system", content: args.system },
          { role: "user", content: args.prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI request failed");
    }

    const data = (await response.json()) as {
      choices: Array<{ message?: { content?: string } }>;
    };

    return {
      text: data.choices?.[0]?.message?.content?.trim() ?? "",
      raw: data,
    };
  }

  if (args.provider === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": args.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: args.model,
        max_tokens: 800,
        system: args.system,
        messages: [{ role: "user", content: args.prompt }],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error("Anthropic request failed");
    }

    const data = (await response.json()) as {
      content?: Array<{ text?: string }>;
    };

    return {
      text: data.content?.[0]?.text?.trim() ?? "",
      raw: data,
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent?key=${args.apiKey}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${args.system}\n\n${args.prompt}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Gemini request failed");
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "",
    raw: data,
  };
}
