"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { decryptSecret } from "@/lib/crypto";
import { DEFAULT_MODEL, DEFAULT_PROVIDER, MODELS, Provider } from "@/lib/models";
import { useSettings } from "@/hooks/use-settings";

export default function ChatPanel({
  marketTicker,
  context,
}: {
  marketTicker: string;
  context: unknown;
}) {
  const { isAuthenticated, settings } = useSettings();
  const sendMessage = useAction(api.chat.sendMessage);
  const [providerOverride, setProviderOverride] = useState<Provider | null>(null);
  const [modelOverride, setModelOverride] = useState<string | null>(null);
  const [webSearchOverride, setWebSearchOverride] = useState<boolean | null>(null);
  const provider =
    providerOverride ??
    ((settings?.preferences.defaultProvider as Provider) ?? DEFAULT_PROVIDER);
  const model = modelOverride ?? settings?.preferences.defaultModel ?? DEFAULT_MODEL;
  const webSearch =
    webSearchOverride ?? settings?.preferences.webSearchEnabled ?? false;
  const [vaultPassword, setVaultPassword] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);


  async function handleSend() {
    setError(null);
    if (!input.trim()) return;
    if (!isAuthenticated) {
      setError("Sign in to chat with the market.");
      return;
    }

    const encrypted = settings?.encryptedKeys?.[provider];
    if (!encrypted) {
      setError("No API key saved for this provider. Add it in Settings.");
      return;
    }

    if (!vaultPassword) {
      setError("Enter your vault passphrase to decrypt the API key.");
      return;
    }

    const userMessage = { role: "user" as const, content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const apiKey = await decryptSecret(encrypted, vaultPassword);
      const response = await sendMessage({
        marketTicker,
        provider,
        model,
        apiKey,
        webSearchEnabled: webSearch,
        context,
        messages: nextMessages,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card className="border-border/60 bg-black/40">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-sm text-emerald-200">Market Chat</CardTitle>
          <p className="text-xs text-muted-foreground">Ask about rules, odds, or sentiment.</p>
        </div>
        <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
          {provider}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={provider}
              onValueChange={(value) => {
                const nextProvider = value as Provider;
                setProviderOverride(nextProvider);
                setModelOverride(MODELS[nextProvider][0].value);
              }}
            >
              <SelectTrigger className="bg-black/40">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(MODELS).map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={model} onValueChange={(value) => setModelOverride(value)}>
              <SelectTrigger className="bg-black/40">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {MODELS[provider].map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-black/30 px-3 py-2">
          <div className="space-y-0.5">
            <p className="text-sm text-foreground">Web Search</p>
            <p className="text-xs text-muted-foreground">Add outside context.</p>
          </div>
          <Switch checked={webSearch} onCheckedChange={(value) => setWebSearchOverride(value)} />
        </div>
        <div className="space-y-2">
          <Label>Vault passphrase</Label>
          <Input
            type="password"
            placeholder="Required to decrypt stored API key"
            value={vaultPassword}
            onChange={(event) => setVaultPassword(event.target.value)}
            className="bg-black/40"
          />
        </div>
        <div className="space-y-3">
          <div className="h-56 space-y-3 overflow-y-auto rounded-lg border border-border/60 bg-black/60 p-3 text-sm">
            {messages.length === 0 ? (
              <p className="text-muted-foreground">Ask about this market. The chat is pre-seeded with rules and price history.</p>
            ) : null}
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {message.role === "user" ? "You" : "Terminal"}
                </p>
                <p className="text-foreground">{message.content}</p>
              </div>
            ))}
          </div>
          <Textarea
            placeholder="Ask about drivers, trend, or what could move this market..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-[80px] bg-black/40"
          />
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
          >
            {isSending ? "Thinking..." : "Send Message"}
          </Button>
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
