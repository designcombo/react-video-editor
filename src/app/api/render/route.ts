import { NextResponse } from "next/server";


export async function POST(request: Request) {
	try {
		const body = await request.json(); // Parse the request body


		const response = await fetch("https://api.combo.sh/v1/render", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer cb_bYQbTtE7Yb7R", // JWT Token from environment
			},
			body: JSON.stringify(body),
		});

		const responseData = await response.json();
		if (!response.ok) {
			return NextResponse.json(
				{ message: responseData?.message || "Failed render json to video" },
				{ status: response.status },
			);
		}

		return NextResponse.json(responseData, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
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
				{ status: 400 },
			);
		}
		if (!type) {
			return NextResponse.json(
				{ message: "type parameter is required" },
				{ status: 400 },
			);
		}

		const response = await fetch(`https://api.combo.sh/v1/render/${id}`, {
			headers: {
				Authorization: `Bearer ${process.env.COMBO_SH_JWT}`, // JWT Token from environment
			},
		});

		if (!response.ok) {
			return NextResponse.json(
				{ message: "Failed to fetch export status" },
				{ status: response.status },
			);
		}

		const statusData = await response.json();
		return NextResponse.json(statusData, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
