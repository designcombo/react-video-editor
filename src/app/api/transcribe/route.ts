// app/api/transcribe/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Parse the request body
    const response = await fetch(
      "https://api.designcombo.dev/v1/audios/speech-to-text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COMBO_SK}`
        },
        body: JSON.stringify(body)
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: responseData?.message || "Failed convert audio to text" },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
