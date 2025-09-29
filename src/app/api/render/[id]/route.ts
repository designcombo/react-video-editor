import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "id parameter is required" },
        { status: 400 }
      );
    }

    // For the new API, we need to check the export status
    // The ID passed here should be the render ID from the export response
    const response = await fetch(
      `https://api.designcombo.dev/v1/projects/render/${id}/status`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COMBO_SK}`
        },
        cache: "no-store"
      }
    );

    const statusData = await response.json();

    if (!response.ok) {
      const error = new Error(
        statusData?.message || "Failed to get export status"
      );
      (error as any).status = response.status;
      throw error;
    }

    return NextResponse.json(statusData, { status: 200 });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
