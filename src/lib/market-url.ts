export function parseMarketTicker(input: string) {
  try {
    const url = new URL(input.trim());
    const segments = url.pathname.split("/").filter(Boolean);
    const marketsIndex = segments.findIndex((segment) => segment === "markets");
    if (marketsIndex !== -1 && segments[marketsIndex + 1]) {
      return segments[marketsIndex + 1].toUpperCase();
    }
  } catch {
    return input.trim().toUpperCase();
  }

  return input.trim().toUpperCase();
}
