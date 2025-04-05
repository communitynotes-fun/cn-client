import { NextRequest, NextResponse } from "next/server";

// --- Updated Interfaces ---

// Interface for each object within the 'rows' array
interface MarketParticipantRow {
	marketid: string;
	tx_from: string;
}

// Interface for the final response
interface MarketParticipantCount {
	marketid: string;
	participants: number;
}

// Interface for the nested 'result' object
interface MultiBaasResult {
	rows: MarketParticipantRow[];
	// Add other fields within 'result' if they exist, e.g., 'count', 'offset', etc.
}

// Interface for the overall API response structure
interface MultiBaasResponse {
	status: number;
	message: string;
	result: MultiBaasResult;
}

// --- End of Updated Interfaces ---

export async function GET(request: NextRequest) {
	console.log("Fetching market participants from MultiBaas");
	// 1. Get the secure JWT (API Key) from environment variables
	const apiKey = process.env.CURVEGRID_API_KEY;
	if (!apiKey) {
		console.error("CURVEGRID_API_KEY not configured in environment variables.");
		return NextResponse.json(
			{ error: "API configuration error." },
			{ status: 500 }
		);
	}

	// 2. Get parameters (offset, limit) from the incoming request's URL search parameters
	const searchParams = request.nextUrl.searchParams;
	const offset = searchParams.get("offset") || "0";
	const limit = searchParams.get("limit") || "50";

	// 3. Construct the query parameters for the external API call
	const queryParams = new URLSearchParams({ offset, limit }).toString();

	// 4. Define the external API details
	const eventQuery = "MarketParticipant";
	const hostname =
		process.env.CURVEGRID_APP_DEPLOYMENT_HOST?.replace("/api/v0", "").replace(
			"https://",
			""
		) || "jxutqneljbdfnbq47xrwy2632m.multibaas.com";
	const externalApiUrl = `https://${hostname}/api/v0/queries/${eventQuery}/results?${queryParams}`;

	try {
		// 5. Make the fetch call to the external MultiBaas API
		console.log(`Fetching from MultiBaas: ${externalApiUrl}`);
		const externalResponse = await fetch(externalApiUrl, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: "application/json",
			},
			// cache: 'no-store', // Optional: Uncomment to disable fetch caching
		});

		// 6. Check if the external API call was successful
		if (!externalResponse.ok) {
			const errorText = await externalResponse.text();
			console.error(
				`MultiBaas API Error (${externalResponse.status}): ${errorText}`
			);
			return NextResponse.json(
				{
					error: `Failed to fetch data from external service: ${externalResponse.statusText}`,
					details:
						process.env.NODE_ENV === "development" ? errorText : undefined,
				},
				{ status: externalResponse.status }
			);
		}

		// 7. Get the data and assert the type using the new interface
		const data: MultiBaasResponse = await externalResponse.json();

		// --- Adjustment ---
		// Check if the response status indicates success according to the body itself
		if (data.status !== 200 || data.message !== "success") {
			console.error(
				`MultiBaas returned non-success status in body: Status ${data.status}, Message: ${data.message}`
			);
			return NextResponse.json(
				{ error: `External API indicated failure: ${data.message}` },
				{ status: data.status } // Use status from body if appropriate, or keep original fetch status
			);
		}

		// 8. Process the data to count unique tx_from addresses per marketId
		const participantsByMarket = new Map<string, Set<string>>();

		// Group by marketId and collect unique tx_from addresses
		data.result.rows.forEach((row) => {
			if (!participantsByMarket.has(row.marketid)) {
				participantsByMarket.set(row.marketid, new Set());
			}
			participantsByMarket.get(row.marketid)?.add(row.tx_from);
		});

		// Convert to the desired response format
		const marketParticipantCounts: MarketParticipantCount[] = Array.from(
			participantsByMarket.entries()
		).map(([marketid, participants]) => ({
			marketid,
			participants: participants.size,
		}));

		// Send the processed data back to your frontend client
		return NextResponse.json(marketParticipantCounts);
		// --- End of Adjustment ---
	} catch (error: unknown) {
		console.error("Error in API route (marketVolume):", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: "Internal Server Error", details: errorMessage },
			{ status: 500 }
		);
	}
}

export const dynamic = "force-dynamic";
