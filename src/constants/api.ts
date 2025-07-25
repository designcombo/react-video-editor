export const API_ENDPOINTS = {
	CHAT: "/api/chat",
	GENERATE_IMAGE: "/api/generate-image",
	GENERATE_AUDIO: "/api/generate-audio",
	SCHEMA: "/api/schema",
	SCHEME: {
		BASE: "https://scheme.combo.sh",
		CREATE: "https://scheme.combo.sh/schemes",
		RUN: (id: string) => `https://scheme.combo.sh/run/${id}`,
	},
} as const;
