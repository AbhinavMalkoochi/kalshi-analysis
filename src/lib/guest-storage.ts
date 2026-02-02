"use client";

const STORAGE_KEY = "kalshi-guest-settings";

export type GuestSettings = {
  encryptedKeys: Record<string, { ciphertext: string; iv: string; salt: string }>;
  preferences: {
    defaultProvider?: string;
    defaultModel?: string;
    webSearchEnabled?: boolean;
  };
};

export function loadGuestSettings(): GuestSettings | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GuestSettings;
  } catch {
    return null;
  }
}

export function saveGuestSettings(settings: GuestSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
