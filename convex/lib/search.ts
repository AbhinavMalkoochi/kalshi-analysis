export type WebResult = {
  title: string;
  url: string;
  snippet: string;
};

const MAX_RESULTS = 5;

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export async function webSearch(query: string): Promise<WebResult[]> {
  const url = new URL("https://r.jina.ai/http://duckduckgo.com/html/");
  url.searchParams.set("q", query);

  const response = await fetch(url.toString(), {
    headers: { "user-agent": "market-terminal" },
  });

  if (!response.ok) {
    return [];
  }

  const html = await response.text();
  const results: WebResult[] = [];
  const anchorRegex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(html)) && results.length < MAX_RESULTS) {
    const urlMatch = match[1];
    const title = normalize(match[2].replace(/<[^>]+>/g, ""));
    const snippetRegex = new RegExp(
      `<a[^>]*href="${urlMatch.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}"[^>]*>.*?<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>`,
      "i",
    );
    const snippetMatch = snippetRegex.exec(html);
    const snippet = snippetMatch ? normalize(snippetMatch[1].replace(/<[^>]+>/g, "")) : "";
    results.push({ title, url: urlMatch, snippet });
  }

  return results;
}
