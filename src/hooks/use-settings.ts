"use client";

import { useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { loadGuestSettings, saveGuestSettings } from "@/lib/guest-storage";
import type { Provider } from "@/lib/models";

export type EncryptedKey = { ciphertext: string; iv: string; salt: string };

export type SettingsPayload = {
  encryptedKeys: Record<string, EncryptedKey>;
  preferences: {
    defaultProvider?: Provider | string;
    defaultModel?: string;
    webSearchEnabled?: boolean;
  };
};

export function useSettings() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const serverSettings = useQuery(api.settings.getForUser);
  const upsertSettings = useMutation(api.settings.upsert);
  const [guestSettings, setGuestSettings] = useState<SettingsPayload | null>(
    () => loadGuestSettings(),
  );

  async function saveSettings(payload: SettingsPayload) {
    if (isAuthenticated) {
      await upsertSettings(payload);
      return;
    }
    saveGuestSettings(payload);
    setGuestSettings(payload);
  }

  return {
    isAuthenticated,
    isLoading,
    settings: isAuthenticated ? serverSettings ?? null : guestSettings,
    saveSettings,
  };
}
