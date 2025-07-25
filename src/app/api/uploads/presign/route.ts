import { NextRequest, NextResponse } from "next/server";

interface PresignRequest {
	userId: string;
	fileNames: string[];
}

interface ExternalPresignResponse {
	fileName: string;
	filePath: string;
	contentType: string;
	presignedUrl: string;
	folder?: string;
	url: string;
}

interface ExternalPresignsResponse {
	uploads: ExternalPresignResponse[];
}

export async function POST(request: NextRequest) {
	try {
		const body: PresignRequest = await request.json();
		const { userId, fileNames } = body;

		if (!userId) {
			return NextResponse.json(
				{ error: "userId is required" },
				{ status: 400 }
			);
		}

		if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
			return NextResponse.json(
				{ error: "fileNames array is required and must not be empty" },
				{ status: 400 }
			);
		}

		// Call external presigned URL service
		const externalResponse = await fetch("https://upload-file-j43uyuaeza-uc.a.run.app/presigned", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
				fileNames,
			}),
		});

		if (!externalResponse.ok) {
			const errorData = await externalResponse.json();
			return NextResponse.json(
				{ 
					error: "External presigned URL service failed", 
					details: errorData 
				},
				{ status: externalResponse.status }
			);
		}

		const externalData: ExternalPresignsResponse = await externalResponse.json();
		const { uploads = [] } = externalData;

		return NextResponse.json({
			success: true,
			uploads: uploads,
		});

	} catch (error) {
		console.error("Error in presign route:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
