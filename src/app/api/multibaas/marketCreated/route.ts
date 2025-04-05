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
	const tweetId = searchParams.get("tweetId"); // Extract tweetId

	// 4. Define the external API details
	const hostname =
		process.env.CURVEGRID_APP_DEPLOYMENT_HOST?.replace("/api/v0", "").replace(
			"https://",
			""
		) || "jxutqneljbdfnbq47xrwy2632m.multibaas.com";
	// The base URL for queries, offset and limit are now part of the POST body or default query params for the POST endpoint
	// const externalApiUrl = `https://${hostname}/api/v0/queries?offset=${offset}&limit=${limit}`; // Original URL with query params
	const externalApiUrl = `https://${hostname}/api/v0/queries`; // Modified URL without query params for POST

	// Define the request body based on the new API requirements
	// Use 'const' as the object reference itself isn't reassigned
	const requestBody: any = {
		offset: parseInt(offset, 10), // Add offset, parsed as integer
		limit: parseInt(limit, 10), // Add limit, parsed as integer
		events: [
			{
				select: [
					{ name: "marketId", type: "input", alias: "", inputIndex: 0 },
					{ name: "creator", type: "input", alias: "", inputIndex: 1 },
					{ name: "tweetId", type: "input", alias: "", inputIndex: 2 },
					{ name: "creationTime", type: "input", alias: "", inputIndex: 3 },
					{ name: "deadline", type: "input", alias: "", inputIndex: 4 },
				],
				eventName: "MarketCreated(uint256,address,string,uint256,uint256)",
				// Filter is removed from the base definition
			},
		],
		groupBy: "marketId",
	};

	// Conditionally add the filter if tweetId is present
	if (tweetId) {
		requestBody.events[0].filter = {
			rule: "and",
			children: [
				{
					rule: "and",
					children: [
						{
							value: tweetId, // Use the extracted tweetId
							operator: "Equal",
							fieldType: "input",
							inputIndex: 2, // Correct index for tweetId
						},
					],
				},
			],
		};
		console.log("Filtering by tweetId:", tweetId); // Optional: log when filtering
	}

	try {
		// 5. Make the fetch call to the external MultiBaas API using POST
		console.log(`Posting to MultiBaas: ${externalApiUrl}`);
		const externalResponse = await fetch(externalApiUrl, {
			method: "POST", // Changed from GET to POST
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json", // Added Content-Type header
				Accept: "application/json",
			},
			body: JSON.stringify(requestBody), // Added the request body
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
