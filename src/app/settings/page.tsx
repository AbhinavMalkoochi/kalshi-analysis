"use client";

import { useState } from "react";
import SiteHeader from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { DEFAULT_MODEL, DEFAULT_PROVIDER, MODELS, Provider } from "@/lib/models";
import { useSettings } from "@/hooks/use-settings";

const PROVIDER_LABELS: Record<Provider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  gemini: "Gemini",
};

export default function SettingsPage() {
  const { isAuthenticated, settings, saveSettings } = useSettings();
  const [defaultProvider, setDefaultProvider] = useState<Provider>(
    (settings?.preferences.defaultProvider as Provider) ?? DEFAULT_PROVIDER,
  );
  const [defaultModel, setDefaultModel] = useState(
    settings?.preferences.defaultModel ?? DEFAULT_MODEL,
  );
  const [webSearchEnabled, setWebSearchEnabled] = useState(
    settings?.preferences.webSearchEnabled ?? true,
  );
  const [apiKeys, setApiKeys] = useState<Record<Provider, string>>({
    openai: "",
    anthropic: "",
    gemini: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setStatus(null);
    setError(null);

    try {
      const encryptedKeys = { ...(settings?.encryptedKeys ?? {}) } as Record<string, string>;

      for (const provider of Object.keys(apiKeys) as Provider[]) {
        const value = apiKeys[provider].trim();
        if (value) {
          encryptedKeys[provider] = value;
        }
      }

      await saveSettings({
        encryptedKeys,
        preferences: {
          defaultProvider,
          defaultModel,
          webSearchEnabled,
        },
      });

      setApiKeys({ openai: "", anthropic: "", gemini: "" });
      setStatus(isAuthenticated ? "Saved to cloud." : "Saved locally for guest session.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.");
    }
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-10">
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
            Settings
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">AI Settings</h1>
          <p className="text-sm text-muted-foreground">
            Set your default provider, model, and API key in one place.
          </p>
        </section>

        <Card className="border-border/60 bg-black/40">
          <CardHeader>
            <CardTitle className="text-sm text-emerald-200">Provider & Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Provider</Label>
              <Select value={defaultProvider} onValueChange={(value) => {
                const next = value as Provider;
                setDefaultProvider(next);
                setDefaultModel(MODELS[next][0].value);
              }}>
                <SelectTrigger className="bg-black/40">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Model</Label>
              <Select value={defaultModel} onValueChange={setDefaultModel}>
                <SelectTrigger className="bg-black/40">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {MODELS[defaultProvider].map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>API Keys</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {Object.keys(PROVIDER_LABELS).map((provider) => (
                  <div key={provider} className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      {PROVIDER_LABELS[provider as Provider]} API Key
                    </Label>
                    <Input
                      type="password"
                      value={apiKeys[provider as Provider]}
                      onChange={(event) =>
                        setApiKeys((prev) => ({
                          ...prev,
                          [provider]: event.target.value,
                        }))
                      }
                      placeholder={`Paste ${PROVIDER_LABELS[provider as Provider]} key`}
                      className="bg-black/40"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-black/30 px-3 py-2 md:col-span-2">
              <div className="space-y-0.5">
                <p className="text-sm text-foreground">Web Search</p>
                <p className="text-xs text-muted-foreground">Include open web context.</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-pressed={webSearchEnabled}
                onClick={() => setWebSearchEnabled((prev) => !prev)}
                className={webSearchEnabled ? "bg-emerald-500/10 text-emerald-200" : "text-muted-foreground"}
              >
                <Globe />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
        >
          Save Settings
        </Button>

        {status ? <p className="text-xs text-emerald-200/80">{status}</p> : null}
        {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      </main>
    </div>
  );
}
