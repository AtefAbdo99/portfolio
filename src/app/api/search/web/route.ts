import { NextRequest, NextResponse } from "next/server";

interface WebResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  type: string;
  relevanceScore?: number;
}

// Deep web search using multiple sources
export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 15, deepSearch = true } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const allResults: WebResult[] = [];

    // Search 1: DuckDuckGo
    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const ddgResponse = await fetch(ddgUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      });
      const ddgHtml = await ddgResponse.text();
      
      const resultRegex = /<a class="result__a" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
      let match;
      while ((match = resultRegex.exec(ddgHtml)) !== null && allResults.length < maxResults) {
        const url = match[1];
        const title = match[2].replace(/<[^>]+>/g, "").trim();
        const snippet = match[3].replace(/<[^>]+>/g, "").trim();
        if (title && url) {
          const domain = new URL(url).hostname.replace("www.", "");
          allResults.push({ title, url, snippet, domain, type: "web" });
        }
      }
    } catch (e) { console.error("DDG error:", e); }

    // Search 2: Wikipedia API for academic context
    if (deepSearch) {
      try {
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=5&origin=*`;
        const wikiResponse = await fetch(wikiUrl);
        const wikiData = await wikiResponse.json();
        
        (wikiData.query?.search || []).forEach((item: any) => {
          allResults.push({
            title: item.title,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
            snippet: item.snippet.replace(/<[^>]+>/g, "").trim(),
            domain: "wikipedia.org",
            type: "encyclopedia",
            relevanceScore: 0.9,
          });
        });
      } catch (e) { console.error("Wiki error:", e); }
    }

    // Search 3: arXiv for preprints (academic)
    if (deepSearch && (query.toLowerCase().includes("ai") || query.toLowerCase().includes("machine learning") || query.toLowerCase().includes("research"))) {
      try {
        const arxivUrl = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5`;
        const arxivResponse = await fetch(arxivUrl);
        const arxivXml = await arxivResponse.text();
        
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let entry;
        while ((entry = entryRegex.exec(arxivXml)) !== null) {
          const titleMatch = entry[1].match(/<title>([\s\S]*?)<\/title>/);
          const summaryMatch = entry[1].match(/<summary>([\s\S]*?)<\/summary>/);
          const idMatch = entry[1].match(/<id>([\s\S]*?)<\/id>/);
          
          if (titleMatch && idMatch) {
            allResults.push({
              title: titleMatch[1].replace(/\n/g, " ").trim(),
              url: idMatch[1].trim(),
              snippet: summaryMatch ? summaryMatch[1].replace(/\n/g, " ").trim().slice(0, 300) : "",
              domain: "arxiv.org",
              type: "preprint",
              relevanceScore: 0.95,
            });
          }
        }
      } catch (e) { console.error("arXiv error:", e); }
    }

    // Deduplicate and score results
    const uniqueResults = allResults.reduce((acc: WebResult[], curr) => {
      if (!acc.find(r => r.url === curr.url || r.title.toLowerCase() === curr.title.toLowerCase())) {
        acc.push(curr);
      }
      return acc;
    }, []);

    // Sort by relevance (academic sources first)
    const sortedResults = uniqueResults.sort((a, b) => {
      const scoreA = a.relevanceScore || (a.type === "preprint" ? 0.9 : a.type === "encyclopedia" ? 0.8 : 0.5);
      const scoreB = b.relevanceScore || (b.type === "preprint" ? 0.9 : b.type === "encyclopedia" ? 0.8 : 0.5);
      return scoreB - scoreA;
    });

    return NextResponse.json({ 
      results: sortedResults.slice(0, maxResults),
      totalCount: sortedResults.length,
      query,
      source: "Deep Web Search",
      sources: ["DuckDuckGo", "Wikipedia", "arXiv"],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Web search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
