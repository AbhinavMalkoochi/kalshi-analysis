import SiteHeader from "@/components/site-header";
import MarketSearch from "@/components/market-search";
import MarketGrid from "@/components/market-grid";
import { getMarkets } from "@/lib/kalshi";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams?: { cursor?: string };
}) {
  const { markets, cursor } = await getMarkets({
    cursor: searchParams?.cursor,
    limit: 24,
  });

  return (
    <div className="min-h-screen bg-black text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
            Market Intelligence
          </p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Discover live Kalshi markets in a Bloomberg-inspired terminal.
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Paste a market URL for instant access or browse live markets. AI analysis is on-demand to
            protect your token budget.
          </p>
          <MarketSearch />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-200">Live Markets</h2>
            <span className="text-xs text-muted-foreground">Showing {markets.length} markets</span>
          </div>
          <MarketGrid markets={markets} />
          <div className="flex justify-end">
            {cursor ? (
              <Link
                href={`/?cursor=${cursor}`}
                className="text-sm text-emerald-200 hover:text-emerald-100"
              >
                Load more →
              </Link>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
