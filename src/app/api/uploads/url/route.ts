import { NextRequest, NextResponse } from "next/server";

interface UploadUrlRequest {
	userId: string;
	urls: string[];
}

interface ExternalUploadResponse {
	fileName: string;
	filePath: string;
	contentType: string;
	originalUrl: string;
	folder?: string;
	url: string;
}

interface ExternalUploadsResponse {
	uploads: ExternalUploadResponse[];
}

export async function POST(request: NextRequest) {
	try {
		const body: UploadUrlRequest = await request.json();
		const { userId, urls } = body;

		if (!userId) {
			return NextResponse.json(
				{ error: "userId is required" },
				{ status: 400 }
			);
		}

		if (!urls || !Array.isArray(urls) || urls.length === 0) {
			return NextResponse.json(
				{ error: "urls array is required and must not be empty" },
				{ status: 400 }
			);
		}

		// Call external upload service
		const externalResponse = await fetch("https://upload-file-j43uyuaeza-uc.a.run.app/url", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
				urls,
			}),
		});

		if (!externalResponse.ok) {
			const errorData = await externalResponse.json();
			return NextResponse.json(
				{ 
					error: "External upload service failed", 
					details: errorData 
				},
				{ status: externalResponse.status }
			);
		}

		const externalData: ExternalUploadsResponse = await externalResponse.json();
		const { uploads = [] } = externalData;

		return NextResponse.json({
			success: true,
			uploads: uploads,
		});

	} catch (error) {
		console.error("Error in upload URL route:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
