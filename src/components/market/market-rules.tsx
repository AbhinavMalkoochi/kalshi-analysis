type MarketRulesProps = {
  rulesPrimary?: string;
  rulesSecondary?: string;
  resolution?: string | null;
  rulesUrl?: string;
};

export default function MarketRules({
  rulesPrimary,
  rulesSecondary,
  resolution,
  rulesUrl,
}: MarketRulesProps) {
  return (
    <div className="rounded-lg border border-gray-700/80 bg-gray-900/90 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
        <h3 className="font-medium text-emerald-300">Market Rules</h3>
        {rulesUrl && (
          <a
            href={rulesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200"
          >
            View Full Rules
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-4 text-sm">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">Primary</p>
          <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
            {rulesPrimary || "No primary rules provided."}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">Secondary</p>
          <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
            {rulesSecondary || "No secondary rules provided."}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">Resolution</p>
          <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
            {resolution || "Resolution criteria not published."}
          </p>
        </div>
      </div>
    </div>
  );
}
