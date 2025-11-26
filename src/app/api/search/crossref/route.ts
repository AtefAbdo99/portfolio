import { NextRequest, NextResponse } from "next/server";

// CrossRef API (free, no API key required)
const CROSSREF_BASE = "https://api.crossref.org/works";

interface CrossRefWork {
  doi: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  type: string;
  citedBy: number;
  url: string;
  abstract?: string;
  issn?: string;
  publisher: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 20, type, fromYear } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Build search URL
    let searchUrl = `${CROSSREF_BASE}?query=${encodeURIComponent(query)}&rows=${maxResults}&select=DOI,title,author,container-title,published,type,is-referenced-by-count,URL,abstract,ISSN,publisher`;
    
    if (type) {
      searchUrl += `&filter=type:${type}`;
    }
    
    if (fromYear) {
      searchUrl += `&filter=from-pub-date:${fromYear}`;
    }

    const response = await fetch(searchUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "AtefHassanPortfolio/1.0 (mailto:atefabdo26399@gmail.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.status}`);
    }

    const data = await response.json();
    
    const works: CrossRefWork[] = (data.message?.items || []).map((item: any) => {
      const authors = (item.author || []).slice(0, 5).map((a: any) => 
        `${a.given || ""} ${a.family || ""}`.trim()
      );
      
      const year = item.published?.["date-parts"]?.[0]?.[0] || 
                   item["published-print"]?.["date-parts"]?.[0]?.[0] ||
                   item["published-online"]?.["date-parts"]?.[0]?.[0];

      return {
        doi: item.DOI,
        title: Array.isArray(item.title) ? item.title[0] : item.title || "",
        authors,
        journal: Array.isArray(item["container-title"]) ? item["container-title"][0] : item["container-title"] || "",
        year: year || null,
        type: item.type || "",
        citedBy: item["is-referenced-by-count"] || 0,
        url: item.URL || `https://doi.org/${item.DOI}`,
        abstract: item.abstract ? item.abstract.replace(/<[^>]+>/g, "").slice(0, 500) : undefined,
        issn: Array.isArray(item.ISSN) ? item.ISSN[0] : item.ISSN,
        publisher: item.publisher || "",
      };
    });

    return NextResponse.json({ 
      results: works,
      totalCount: data.message?.["total-results"] || works.length,
      query,
      source: "CrossRef",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("CrossRef search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
