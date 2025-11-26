import { NextRequest, NextResponse } from "next/server";

// ClinicalTrials.gov API (free, no API key required)
const CLINICALTRIALS_BASE = "https://clinicaltrials.gov/api/v2/studies";

interface ClinicalTrial {
  nctId: string;
  title: string;
  status: string;
  phase: string;
  conditions: string[];
  interventions: string[];
  sponsor: string;
  startDate: string;
  completionDate: string;
  enrollment: number;
  studyType: string;
  url: string;
  briefSummary: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 20, status, phase, studyType } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Build filter array
    const filters: string[] = [];
    if (status) filters.push(`query.term:${status}`);
    
    // Build search URL
    let searchUrl = `${CLINICALTRIALS_BASE}?query.term=${encodeURIComponent(query)}&pageSize=${maxResults}&format=json`;
    
    if (status) {
      searchUrl += `&filter.overallStatus=${status}`;
    }
    
    if (phase) {
      searchUrl += `&filter.phase=${phase}`;
    }
    
    if (studyType) {
      searchUrl += `&filter.studyType=${studyType}`;
    }

    const response = await fetch(searchUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`ClinicalTrials.gov API error: ${response.status}`);
    }

    const data = await response.json();
    
    const trials: ClinicalTrial[] = (data.studies || []).map((study: any) => {
      const protocol = study.protocolSection || {};
      const identification = protocol.identificationModule || {};
      const status = protocol.statusModule || {};
      const design = protocol.designModule || {};
      const sponsor = protocol.sponsorCollaboratorsModule || {};
      const conditions = protocol.conditionsModule || {};
      const interventions = protocol.armsInterventionsModule || {};
      const description = protocol.descriptionModule || {};

      return {
        nctId: identification.nctId || "",
        title: identification.briefTitle || identification.officialTitle || "",
        status: status.overallStatus || "",
        phase: design.phases?.join(", ") || "N/A",
        conditions: conditions.conditions?.slice(0, 5) || [],
        interventions: (interventions.interventions || []).slice(0, 3).map((i: any) => i.name),
        sponsor: sponsor.leadSponsor?.name || "",
        startDate: status.startDateStruct?.date || "",
        completionDate: status.completionDateStruct?.date || "",
        enrollment: design.enrollmentInfo?.count || 0,
        studyType: design.studyType || "",
        url: `https://clinicaltrials.gov/study/${identification.nctId}`,
        briefSummary: description.briefSummary?.slice(0, 400) || "",
      };
    });

    return NextResponse.json({ 
      results: trials,
      totalCount: data.totalCount || trials.length,
      query,
      source: "ClinicalTrials.gov",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("ClinicalTrials search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
