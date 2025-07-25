// Types based on Kysely schema to replace Prisma imports
export interface Token {
	id: string;
	name: string;
	key: string;
	createdAt: Date;
	expiresAt: Date;
	userId: string;
}

export interface Upload {
	id: string;
	fileName: string;
	filePath: string;
	fileSize: number;
	contentType: string;
	metadata: any | null;
	folder: string | null;
	type: "VIDEO" | "IMAGE" | "AUDIO" | "DOCUMENT" | "OTHER";
	method: "USER" | "API" | "SYSTEM" | "OTHER";
	origin: "USER_CREATED" | "AI_GENERATED" | "UNKNOWN";
	status: "PENDING" | "COMPLETED" | "FAILED";
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	isPreview: boolean;
}
