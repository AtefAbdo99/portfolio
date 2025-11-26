import { NextRequest, NextResponse } from "next/server";

// PubMed/NCBI E-utilities API (free, no API key required for basic usage)
const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  pubDate: string;
  abstract: string;
  doi?: string;
  pmcid?: string;
  pubType: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 20, sortBy = "relevance", filters } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Build search query with filters
    let searchQuery = query;
    
    if (filters) {
      if (filters.dateFrom) {
        searchQuery += ` AND ("${filters.dateFrom}"[Date - Publication] : "3000"[Date - Publication])`;
      }
      if (filters.articleTypes && filters.articleTypes.length > 0) {
        const typeFilter = filters.articleTypes.map((t: string) => `"${t}"[Publication Type]`).join(" OR ");
        searchQuery += ` AND (${typeFilter})`;
      }
      if (filters.freeFullText) {
        searchQuery += " AND free full text[filter]";
      }
      if (filters.humans) {
        searchQuery += " AND humans[MeSH Terms]";
      }
    }

    // Step 1: Search for PMIDs
    const searchUrl = `${PUBMED_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchQuery)}&retmax=${maxResults}&sort=${sortBy === "date" ? "pub_date" : "relevance"}&retmode=json`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    const pmids = searchData.esearchresult?.idlist || [];
    
    if (pmids.length === 0) {
      return NextResponse.json({ 
        results: [],
        totalCount: 0,
        query: searchQuery,
        source: "PubMed"
      });
    }

    // Step 2: Fetch article details
    const fetchUrl = `${PUBMED_BASE}/efetch.fcgi?db=pubmed&id=${pmids.join(",")}&retmode=xml`;
    const fetchResponse = await fetch(fetchUrl);
    const xmlData = await fetchResponse.text();

    // Parse XML to extract article info
    const articles: PubMedArticle[] = [];
    const articleRegex = /<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g;
    let match;

    while ((match = articleRegex.exec(xmlData)) !== null) {
      const articleXml = match[1];
      
      // Extract PMID
      const pmidMatch = articleXml.match(/<PMID[^>]*>(\d+)<\/PMID>/);
      const pmid = pmidMatch ? pmidMatch[1] : "";

      // Extract title
      const titleMatch = articleXml.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";

      // Extract authors
      const authors: string[] = [];
      const authorRegex = /<Author[^>]*>[\s\S]*?<LastName>([\s\S]*?)<\/LastName>[\s\S]*?<ForeName>([\s\S]*?)<\/ForeName>/g;
      let authorMatch;
      while ((authorMatch = authorRegex.exec(articleXml)) !== null && authors.length < 5) {
        authors.push(`${authorMatch[2]} ${authorMatch[1]}`);
      }

      // Extract journal
      const journalMatch = articleXml.match(/<Title>([\s\S]*?)<\/Title>/);
      const journal = journalMatch ? journalMatch[1].trim() : "";

      // Extract publication date
      const yearMatch = articleXml.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/);
      const monthMatch = articleXml.match(/<PubDate>[\s\S]*?<Month>(\w+)<\/Month>/);
      const pubDate = yearMatch ? `${monthMatch ? monthMatch[1] + " " : ""}${yearMatch[1]}` : "";

      // Extract abstract
      const abstractMatch = articleXml.match(/<Abstract>([\s\S]*?)<\/Abstract>/);
      let abstract = "";
      if (abstractMatch) {
        abstract = abstractMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
      }

      // Extract DOI
      const doiMatch = articleXml.match(/<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/);
      const doi = doiMatch ? doiMatch[1].trim() : undefined;

      // Extract PMCID
      const pmcidMatch = articleXml.match(/<ArticleId IdType="pmc">([\s\S]*?)<\/ArticleId>/);
      const pmcid = pmcidMatch ? pmcidMatch[1].trim() : undefined;

      // Extract publication types
      const pubTypes: string[] = [];
      const pubTypeRegex = /<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g;
      let pubTypeMatch;
      while ((pubTypeMatch = pubTypeRegex.exec(articleXml)) !== null) {
        pubTypes.push(pubTypeMatch[1].trim());
      }

      if (pmid && title) {
        articles.push({
          pmid,
          title,
          authors,
          journal,
          pubDate,
          abstract,
          doi,
          pmcid,
          pubType: pubTypes,
        });
      }
    }

    return NextResponse.json({ 
      results: articles,
      totalCount: parseInt(searchData.esearchresult?.count || "0"),
      query: searchQuery,
      source: "PubMed",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("PubMed search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
