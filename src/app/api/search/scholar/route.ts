import { NextRequest, NextResponse } from "next/server";

// Semantic Scholar API (free, no API key required for basic usage)
const SEMANTIC_SCHOLAR_BASE = "https://api.semanticscholar.org/graph/v1";

interface ScholarPaper {
  paperId: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  citationCount: number;
  venue: string;
  url: string;
  isOpenAccess: boolean;
  fieldsOfStudy: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 20, yearFrom, yearTo, fieldsOfStudy } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Build search URL with filters
    let searchUrl = `${SEMANTIC_SCHOLAR_BASE}/paper/search?query=${encodeURIComponent(query)}&limit=${maxResults}&fields=paperId,title,authors,year,abstract,citationCount,venue,url,isOpenAccess,fieldsOfStudy`;
    
    if (yearFrom) {
      searchUrl += `&year=${yearFrom}-${yearTo || new Date().getFullYear()}`;
    }
    
    if (fieldsOfStudy && fieldsOfStudy.length > 0) {
      searchUrl += `&fieldsOfStudy=${fieldsOfStudy.join(",")}`;
    }

    const response = await fetch(searchUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }

    const data = await response.json();
    
    const papers: ScholarPaper[] = (data.data || []).map((paper: any) => ({
      paperId: paper.paperId,
      title: paper.title || "",
      authors: (paper.authors || []).slice(0, 5).map((a: any) => a.name),
      year: paper.year,
      abstract: paper.abstract ? paper.abstract.slice(0, 500) : "",
      citationCount: paper.citationCount || 0,
      venue: paper.venue || "",
      url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
      isOpenAccess: paper.isOpenAccess || false,
      fieldsOfStudy: paper.fieldsOfStudy || [],
    }));

    return NextResponse.json({ 
      results: papers,
      totalCount: data.total || papers.length,
      query,
      source: "Semantic Scholar",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Semantic Scholar search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
