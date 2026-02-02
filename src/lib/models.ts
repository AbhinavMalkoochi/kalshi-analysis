export const PROVIDERS = ["openai", "anthropic", "gemini"] as const;
export type Provider = (typeof PROVIDERS)[number];

export const MODELS: Record<Provider, { label: string; value: string }[]> = {
  openai: [
    { label: "GPT-4o Mini", value: "gpt-4o-mini" },
    { label: "GPT-4o", value: "gpt-4o" },
  ],
  anthropic: [
    { label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20240620" },
    { label: "Claude 3.5 Haiku", value: "claude-3-5-haiku-20241022" },
  ],
  gemini: [
    { label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
    { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
  ],
};

export const DEFAULT_PROVIDER: Provider = "openai";
export const DEFAULT_MODEL = MODELS.openai[0].value;
