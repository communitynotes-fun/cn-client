import { OpenAI } from "openai";
import { ethers } from "ethers";

// Constants matching our EmbeddingVerifier contract
export const EMBEDDING_DIMENSION = 1536;
export const MODEL = "text-embedding-3-small"; // This model outputs 1536 dimensions

/**
 * Generates an embedding for text using OpenAI's API
 * @param text The text to generate an embedding for
 * @returns The embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OPENAI_API_KEY environment variable is not set");
	}

	try {
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const response = await openai.embeddings.create({
			model: MODEL,
			input: text,
			dimensions: EMBEDDING_DIMENSION,
		});

		return response.data[0].embedding;
	} catch (error) {
		console.error("Error generating embedding:", error);
		throw error;
	}
}

/**
 * Encodes an embedding for use in smart contracts
 * @param embedding The embedding vector to encode
 * @returns The encoded embedding as a Uint8Array
 */
export function encodeEmbedding(embedding: number[]): Uint8Array {
	// Verify dimension
	if (embedding.length !== EMBEDDING_DIMENSION) {
		throw new Error(
			`Expected ${EMBEDDING_DIMENSION} dimensions but got ${embedding.length}`
		);
	}

	// Convert the floating point values to fixed-point format
	const wadEmbedding = embedding.map((value) => {
		return BigInt(Math.floor(value * 1e18));
	});

	// Define the scale factor
	const scaleFactorBigInt = 3n * 10n ** 13n; // Use 3e13

	// Encode each value as a 2-byte int16
	const encoded = new Uint8Array(embedding.length * 2);

	wadEmbedding.forEach((wadValue, index) => {
		// Scale down using the adjusted factor
		const int16Value = Number(wadValue / scaleFactorBigInt);

		// Clamp the value to int16 range
		const clampedValue = Math.max(-32768, Math.min(32767, int16Value));

		// Convert to bytes
		const view = new DataView(encoded.buffer);
		view.setInt16(index * 2, clampedValue, false); // false for big-endian
	});

	return encoded;
}

// /**
//  * Generates and encodes an embedding for use in smart contracts
//  * @param text The text to generate an embedding for
//  * @returns The embedding and its encoded form
//  */
// export async function generateAndEncodeEmbedding(text: string): Promise<{
// 	embedding: number[];
// 	encoded: Uint8Array;
// }> {
// 	const embedding = await generateEmbedding(text);
// 	const encoded = encodeEmbedding(embedding);

// 	return {
// 		embedding,
// 		encoded,
// 	};
// }

/**
 * Generates and encodes an embedding for use in smart contracts
 * @param text The text to generate an embedding for
 * @param embedding Optional pre-generated embedding
 * @returns The embedding, wadEmbedding, and encoded form
 */
export async function generateAndEncodeEmbedding(
	text: string,
	embedding: number[] | null = null
): Promise<{
	embedding: number[];
	wadEmbedding: bigint[];
	encoded: string;
}> {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OPENAI_API_KEY environment variable is not set");
	}

	try {
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		// If embedding is not provided, generate it from OpenAI
		if (!embedding) {
			const response = await openai.embeddings.create({
				model: MODEL,
				input: text,
				dimensions: EMBEDDING_DIMENSION,
			});
			embedding = response.data[0].embedding;
		}

		// Verify dimension
		if (embedding.length !== EMBEDDING_DIMENSION) {
			throw new Error(
				`Expected ${EMBEDDING_DIMENSION} dimensions but got ${embedding.length}`
			);
		}

		// Convert the floating point values to our contract's fixed-point format
		const wadEmbedding = embedding.map((value: number) => {
			return BigInt(Math.floor(value * 1e18));
		});

		// Define the adjusted scale factor
		const scaleFactorBigInt = 3n * 10n ** 13n; // Use 3e13

		// Encode each value as a 2-byte int16
		const encoded = ethers.concat(
			wadEmbedding.map((wadValue: bigint) => {
				// Scale down using the adjusted factor
				const int16Value = Number(wadValue / scaleFactorBigInt);

				// Clamp the value to int16 range
				const clampedValue = Math.max(-32768, Math.min(32767, int16Value));

				// Convert to bytes
				const buffer = new ArrayBuffer(2);
				const view = new DataView(buffer);
				view.setInt16(0, clampedValue, false); // false for big-endian
				return new Uint8Array(buffer);
			})
		);

		return {
			embedding, // original embedding from OpenAI or provided
			wadEmbedding, // fixed-point version as BigInts
			encoded, // bytes version for contract
		};
	} catch (error) {
		console.error("Error in generateAndEncodeEmbedding:", error);
		throw error;
	}
}
