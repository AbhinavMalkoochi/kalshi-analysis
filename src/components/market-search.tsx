"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseMarketTicker } from "@/lib/market-url";

export default function MarketSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim()) return;
        const ticker = parseMarketTicker(value);
        router.push(`/market/${ticker}`);
      }}
    >
      <Input
        placeholder="Paste a Kalshi market URL or ticker (e.g., KXHIGHNY)"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="flex-1 bg-black/40"
      />
      <Button type="submit" className="bg-emerald-400 text-black hover:bg-emerald-300">
        Open Market
      </Button>
    </form>
  );
}
