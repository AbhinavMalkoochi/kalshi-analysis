"use client";

import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-black/30 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] text-emerald-300">
            MARKET TERMINAL
          </Link>
          <span className="rounded-full border border-emerald-400/30 px-2 py-0.5 text-[10px] uppercase text-emerald-200/80">
            Kalshi
          </span>
        </div>
        <nav className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-emerald-200">
            Markets
          </Link>
          <Link href="/settings" className="hover:text-emerald-200">
            Settings
          </Link>
          <Authenticated>
            <UserButton afterSignOutUrl="/" />
          </Authenticated>
          <Unauthenticated>
            <SignInButton>
              <Button size="sm" variant="outline">
                Sign in
              </Button>
            </SignInButton>
          </Unauthenticated>
        </nav>
      </div>
    </header>
  );
}
