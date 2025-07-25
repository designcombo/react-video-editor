import { NextResponse } from "next/server";
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		if (!id) {
			return NextResponse.json(
				{ message: "id parameter is required" },
				{ status: 400 },
			);
		}

		const response = await fetch(`https://api.combo.sh/v1/render/${id}`, {
			headers: {
				Authorization: "Bearer cb_bYQbTtE7Yb7R", // JWT Token from environment
			},
			cache: "no-store",
		});

		const statusData = await response.json();

		if (!response.ok) {
			const error = new Error(
				statusData?.message || "Failed status render video",
			);
			(error as any).status = response.status;
			throw error;
		}

		return NextResponse.json(statusData, { status: 200 });
	} catch (error: any) {
		console.error(error);

		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
