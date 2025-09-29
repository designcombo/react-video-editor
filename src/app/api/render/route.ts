import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Parse the request body

    // Step 1: Create project using the new API
    const projectResponse = await fetch(
      "https://api.designcombo.dev/v1/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COMBO_SK}`
        },
        body: JSON.stringify(body)
      }
    );

    if (!projectResponse.ok) {
      const projectError = await projectResponse.json();
      return NextResponse.json(
        { message: projectError?.message || "Failed to create project" },
        { status: projectResponse.status }
      );
    }

    const projectData = await projectResponse.json();
    const projectId = projectData.project.id;
    console.log("Project created:", projectId);

    // Step 2: Initialize export
    const exportResponse = await fetch(
      `https://api.designcombo.dev/v1/projects/${projectId}/export`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COMBO_SK}`
        }
      }
    );

    if (!exportResponse.ok) {
      const exportError = await exportResponse.json();
      return NextResponse.json(
        { message: exportError?.message || "Failed to initialize export" },
        { status: exportResponse.status }
      );
    }

    const exportData = await exportResponse.json();
    console.log("Export initialized:", exportData);

    // Return the export data with the render ID for status checking
    return NextResponse.json(exportData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "id parameter is required" },
        { status: 400 }
      );
    }
    if (!type) {
      return NextResponse.json(
        { message: "type parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.combo.sh/v1/render/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.COMBO_SH_JWT}` // JWT Token from environment
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch export status" },
        { status: response.status }
      );
    }

    const statusData = await response.json();
    return NextResponse.json(statusData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
