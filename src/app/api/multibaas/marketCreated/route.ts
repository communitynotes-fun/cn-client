import { NextRequest, NextResponse } from "next/server";

// --- Updated Interfaces ---

// Interface for each object within the 'rows' array
interface MarketRow {
	creationtime: string; // These seem to be string representations of timestamps
	creator: string;
	deadline: string;
	marketid: string;
	tweetid: string;
}

// Interface for the nested 'result' object
interface MultiBaasResult {
	rows: MarketRow[];
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
	console.log("Fetching marketCreated from MultiBaas");
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
	const eventQuery = "MarketCreated";
	const hostname =
		process.env.CURVEGRID_APP_DEPLOYMENT_HOST?.replace("/api/v0", "").replace(
			"https://",
			""
		) || "bax2nz6gvnaf7ouej32tykbzeu.multibaas.com";
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

		// 8. Send the relevant part of the data (the 'result' object) back to your frontend client
		// Or you could send just data.result.rows if that's all you need
		return NextResponse.json(data.result.rows);
		// --- End of Adjustment ---
	} catch (error: unknown) {
		console.error("Error in API route (marketCreated):", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: "Internal Server Error", details: errorMessage },
			{ status: 500 }
		);
	}
}

export const dynamic = "force-dynamic";
