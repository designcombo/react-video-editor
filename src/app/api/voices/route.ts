import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit = 20, page = 1, query = {} } = body;
    console.log(query);

    // Build query with only non-empty arrays
    const formattedQuery: any = {};

    if (query.languages && query.languages.length > 0) {
      formattedQuery.languages = query.languages;
    }

    if (query.genders && query.genders.length > 0) {
      formattedQuery.genders = query.genders;
    }

    // Make request to external API
    const response = await fetch(
      "https://dubbing-152153811339.us-central1.run.app/search-voices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // Add your API token here when you have one
          // "Authorization": `Bearer ${process.env.VOICE_API_TOKEN}`,
        },
        body: JSON.stringify({
          limit,
          page,
          query: formattedQuery
        })
      }
    );

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching voices:", error);
    return NextResponse.json(
      { error: "Failed to fetch voices" },
      { status: 500 }
    );
  }
}
