import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketRules({
  rulesPrimary,
  rulesSecondary,
  resolution,
}: {
  rulesPrimary?: string;
  rulesSecondary?: string;
  resolution?: string | null;
}) {
  return (
    <Card className="border-border/60 bg-black/40">
      <CardHeader>
        <CardTitle className="text-sm text-emerald-200">Market Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Primary</p>
          <p className="whitespace-pre-wrap text-foreground">
            {rulesPrimary || "No primary rules provided."}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Secondary</p>
          <p className="whitespace-pre-wrap text-foreground">
            {rulesSecondary || "No secondary rules provided."}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Resolution</p>
          <p className="whitespace-pre-wrap text-foreground">
            {resolution || "Resolution criteria not published."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
