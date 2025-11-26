import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

// Enhanced RAG: Fetch real-time context from multiple authoritative sources
async function fetchRAGContext(query: string): Promise<{ context: string; sources: string[]; factCount: number }> {
  const sources: string[] = [];
  let factCount = 0;
  
  try {
    const searches = await Promise.allSettled([
      // PubMed search - Medical literature
      fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=8&retmode=json&sort=relevance`)
        .then(r => r.json())
        .then(async (data) => {
          const ids = data.esearchresult?.idlist || [];
          if (ids.length === 0) return [];
          const details = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`);
          const summaries = await details.json();
          sources.push("PubMed");
          return Object.values(summaries.result || {}).filter((r: any) => r.uid).map((r: any) => ({
            source: "PubMed",
            title: r.title,
            authors: r.authors?.slice(0, 3).map((a: any) => a.name).join(", "),
            journal: r.source,
            year: r.pubdate?.split(" ")[0],
            pmid: r.uid,
            type: "peer-reviewed",
          }));
        }),
      // Wikipedia - General knowledge
      fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=3&origin=*`)
        .then(r => r.json())
        .then(data => {
          if (data.query?.search?.length) sources.push("Wikipedia");
          return (data.query?.search || []).map((r: any) => ({
            source: "Wikipedia",
            title: r.title,
            snippet: r.snippet.replace(/<[^>]+>/g, ""),
            type: "encyclopedia",
          }));
        }),
      // Semantic Scholar - AI-powered academic search
      fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=8&fields=title,authors,year,citationCount,venue,abstract`)
        .then(r => r.json())
        .then(data => {
          if (data.data?.length) sources.push("Semantic Scholar");
          return (data.data || []).map((r: any) => ({
            source: "Semantic Scholar",
            title: r.title,
            authors: r.authors?.slice(0, 3).map((a: any) => a.name).join(", "),
            year: r.year,
            citations: r.citationCount,
            venue: r.venue,
            abstract: r.abstract?.slice(0, 200),
            type: "academic",
          }));
        }),
      // CrossRef - DOI metadata
      fetch(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5&select=DOI,title,author,published,container-title,is-referenced-by-count`)
        .then(r => r.json())
        .then(data => {
          if (data.message?.items?.length) sources.push("CrossRef");
          return (data.message?.items || []).map((r: any) => ({
            source: "CrossRef",
            title: Array.isArray(r.title) ? r.title[0] : r.title,
            authors: r.author?.slice(0, 3).map((a: any) => `${a.given} ${a.family}`).join(", "),
            year: r.published?.["date-parts"]?.[0]?.[0],
            journal: Array.isArray(r["container-title"]) ? r["container-title"][0] : r["container-title"],
            citations: r["is-referenced-by-count"],
            doi: r.DOI,
            type: "citation-indexed",
          }));
        }),
      // Europe PMC - Additional medical literature
      fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=5`)
        .then(r => r.json())
        .then(data => {
          if (data.resultList?.result?.length) sources.push("Europe PMC");
          return (data.resultList?.result || []).map((r: any) => ({
            source: "Europe PMC",
            title: r.title,
            authors: r.authorString,
            year: r.pubYear,
            journal: r.journalTitle,
            pmid: r.pmid,
            doi: r.doi,
            type: "open-access",
          }));
        }),
    ]);

    let context = "\n\n---\n## 📚 Real-Time Verified Research Context\n";
    context += `*Sources: ${sources.join(", ") || "Searching..."}*\n`;
    let hasResults = false;

    searches.forEach((result) => {
      if (result.status === "fulfilled" && Array.isArray(result.value) && result.value.length > 0) {
        hasResults = true;
        result.value.forEach((item: any) => {
          factCount++;
          context += `\n**[${item.source}]** ${item.title}`;
          if (item.authors) context += `\n   Authors: ${item.authors}`;
          if (item.year) context += ` | Year: ${item.year}`;
          if (item.citations) context += ` | Citations: ${item.citations}`;
          if (item.journal) context += ` | Journal: ${item.journal}`;
          if (item.pmid) context += ` | PMID: ${item.pmid}`;
          if (item.doi) context += ` | DOI: ${item.doi}`;
          if (item.abstract) context += `\n   > ${item.abstract}...`;
          if (item.snippet) context += `\n   > ${item.snippet}`;
          context += "\n";
        });
      }
    });

    context += `\n*Total verified facts: ${factCount} from ${sources.length} sources*\n`;

    return { context: hasResults ? context : "", sources, factCount };
  } catch (e) {
    console.error("RAG fetch error:", e);
    return { context: "", sources: [], factCount: 0 };
  }
}

// Extract YouTube video IDs from text
function extractMediaLinks(text: string): { videos: string[], hasMedia: boolean } {
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g;
  const videos: string[] = [];
  let match;
  while ((match = youtubeRegex.exec(text)) !== null) {
    videos.push(match[1]);
  }
  return { videos, hasMedia: videos.length > 0 };
}

export async function POST(request: NextRequest) {
  try {
    const { message, mode, files, conversationHistory, enableRAG = true } = await request.json();

    // RAG: Fetch real-time context from multiple sources
    let ragContext = "";
    let ragSources: string[] = [];
    let ragFactCount = 0;
    
    if (enableRAG && message.length > 10) {
      const ragData = await fetchRAGContext(message);
      ragContext = ragData.context;
      ragSources = ragData.sources;
      ragFactCount = ragData.factCount;
    }

    // Process uploaded files context
    let filesContext = "";
    if (files && files.length > 0) {
      filesContext = "\n\n### Attached Files:\n";
      files.forEach((file: { name: string; type: string; content: string }, index: number) => {
        filesContext += `\n**File ${index + 1}: ${file.name}** (${file.type})\n`;
        if (file.content) {
          filesContext += `\`\`\`\n${file.content.slice(0, 5000)}\n\`\`\`\n`;
        }
      });
    }

    let systemPrompt = "";
    
    switch (mode) {
      case "research-ideas":
        systemPrompt = `You are an expert medical research advisor specializing in systematic reviews, meta-analyses, and clinical research. Your role is to suggest innovative, novel, and feasible research ideas.

When suggesting research ideas, provide:
1. A clear research question
2. Why it's novel and important
3. Potential methodology (systematic review, meta-analysis, RCT, etc.)
4. Databases to search (PubMed, Scopus, Cochrane, etc.)
5. Expected impact and potential journals for publication

Focus on:
- Emerging topics in medicine
- Gaps in current evidence
- AI/ML applications in healthcare
- Comparative effectiveness studies
- Underexplored clinical questions

Be specific, practical, and cite any relevant existing work when possible.`;
        break;

      case "systematic-review":
        systemPrompt = `You are a systematic review and meta-analysis expert. Help researchers design and conduct rigorous systematic reviews.

Provide guidance on:
1. PICO/PICOS framework formulation
2. Search strategy development (keywords, MeSH terms, Boolean operators)
3. Database selection and search syntax
4. Inclusion/exclusion criteria
5. Quality assessment tools (ROB 2, ROBINS-I, Newcastle-Ottawa, etc.)
6. Data extraction forms
7. Meta-analysis methods (fixed/random effects, heterogeneity assessment)
8. PRISMA reporting guidelines

Be thorough and methodologically sound.`;
        break;

      case "literature-search":
        systemPrompt = `You are a medical librarian and literature search specialist. Help researchers find relevant studies efficiently.

Provide:
1. Optimized search strings for major databases
2. MeSH terms and subject headings
3. Boolean operator combinations
4. Filters and limits recommendations
5. Grey literature sources
6. Reference tracking strategies

Format search strings properly for PubMed, Scopus, Cochrane, and other databases.`;
        break;

      case "manuscript-help":
        systemPrompt = `You are a medical writing expert and peer review specialist. Help researchers improve their manuscripts.

Assist with:
1. Abstract writing (structured format)
2. Introduction framework
3. Methods section clarity
4. Results presentation
5. Discussion structure
6. Limitations acknowledgment
7. Conclusion writing
8. Title optimization
9. Response to reviewer comments

Follow journal guidelines and academic writing best practices.`;
        break;

      default:
        systemPrompt = `You are Dr. Atef Hassan's AI Research Assistant - a sophisticated scientific AI designed for clinical researchers, medical professionals, and academics.

## Your Expertise:
- **Systematic Reviews & Meta-Analyses**: PRISMA guidelines, PICO framework, risk of bias assessment, forest plots, heterogeneity analysis
- **Clinical Research**: Study design (RCTs, cohort, case-control), sample size calculation, statistical analysis
- **Literature Search**: PubMed, Scopus, Cochrane, Web of Science search strategies, MeSH terms
- **Medical Writing**: Manuscript preparation, peer review response, abstract writing
- **Healthcare AI/ML**: Medical imaging, predictive models, NLP for clinical text
- **Evidence Synthesis**: Quality assessment, GRADE approach, evidence grading

## Response Guidelines:
1. Use **markdown formatting** extensively: tables, bullet points, code blocks, headers
2. Include **tables** for comparisons, study characteristics, or data summaries
3. Provide **structured outputs** with clear sections
4. Use **academic language** appropriate for peer-reviewed publications
5. Cite relevant databases and tools when applicable
6. When analyzing files, provide detailed, structured feedback
7. For statistical queries, include formulas and interpretation guidance

Be thorough, evidence-based, and clinically relevant. Format responses beautifully with proper markdown.

## Special Instructions:
- When recommending videos, include YouTube links in format: https://youtube.com/watch?v=VIDEO_ID
- When citing papers, include PMID or DOI when available
- Always indicate when information is from real-time sources vs your training data
- Provide actionable, practical advice with specific tools and resources`;
    }

    // Build messages array with conversation history
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    // Add current message with files context and RAG context
    let userMessage = message;
    if (filesContext) userMessage += filesContext;
    if (ragContext) userMessage += ragContext;
    messages.push({ role: "user", content: userMessage });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://atef-hassan-portfolio.com",
        "X-Title": "Dr. Atef Hassan Portfolio - AI Research Assistant",
      },
      body: JSON.stringify({
        model: "x-ai/grok-4.1-fast:free",
        messages,
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter error:", error);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "No response generated.";

    // Extract media from response
    const media = extractMediaLinks(aiMessage);

    return NextResponse.json({ 
      response: aiMessage,
      ragEnabled: enableRAG && ragContext.length > 0,
      ragSources: ragSources.length > 0 ? ragSources : undefined,
      ragFactCount: ragFactCount > 0 ? ragFactCount : undefined,
      media: media.hasMedia ? media : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
