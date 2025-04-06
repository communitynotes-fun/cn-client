import { NextResponse } from "next/server";
import { generateAndEncodeEmbedding } from "@/lib/embedding";

export async function POST(request: Request) {
	try {
		const { text } = await request.json();

		if (!text || typeof text !== "string") {
			return NextResponse.json(
				{ error: "Text input is required and must be a string." },
				{ status: 400 }
			);
		}

		const { embedding, encoded } = await generateAndEncodeEmbedding(text);

		// Convert Uint8Array to a regular array of numbers for JSON serialization
		// const encodedArray = Array.from(encoded);

		return NextResponse.json({ embedding, encoded });
	} catch (error: any) {
		console.error("API Error generating embedding:", error);

		// Provide a more specific error message if available
		const errorMessage = error.message || "Failed to generate embedding";
		const status = error.status || 500; // Use error status if available, otherwise default to 500

		return NextResponse.json({ error: errorMessage }, { status });
	}
}
