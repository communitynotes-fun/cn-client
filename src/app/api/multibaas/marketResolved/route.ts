import { NextRequest, NextResponse } from "next/server";

// --- Interfaces (Adjust based on actual MarketResolved response structure if needed) ---
interface MarketResolvedRow {
	marketid: string; // Assuming alias is applied by MultiBaas or default mapping
	hasnote: boolean;
	notetext: string;
	revealtimestamp: string; // Timestamps often come as strings
}

interface MultiBaasResult {
	rows: MarketResolvedRow[];
}

interface MultiBaasResponse {
	status: number;
	message: string;
	result: MultiBaasResult;
}
// --- End of Interfaces ---

export async function GET(request: NextRequest) {
	// Keep GET for Next.js route handler definition
	console.log("Fetching marketResolved from MultiBaas");
	// 1. Get the secure JWT (API Key) from environment variables
	const apiKey = process.env.CURVEGRID_API_KEY;
	if (!apiKey) {
		console.error("CURVEGRID_API_KEY not configured in environment variables.");
		return NextResponse.json(
			{ error: "API configuration error." },
			{ status: 500 }
		);
	}

	// 2. Get parameters (offset, limit, marketId) from the incoming request's URL search parameters
	const searchParams = request.nextUrl.searchParams;
	const offset = searchParams.get("offset") || "0";
	const limit = searchParams.get("limit") || "50";
	const marketId = searchParams.get("marketId"); // Extract marketId for potential filtering

	// 3. Define the external API details
	const hostname =
		process.env.CURVEGRID_APP_DEPLOYMENT_HOST?.replace("/api/v0", "").replace(
			"https://",
			""
		) || "jxutqneljbdfnbq47xrwy2632m.multibaas.com";
	// Use the base queries endpoint for POST requests
	const externalApiUrl = `https://${hostname}/api/v0/queries?offset=${offset}&limit=${limit}`;

	// 4. Define the request body based on the provided structure
	const requestBody: any = {
		events: [
			{
				select: [
					// Use aliases matching expected response fields if possible/needed
					{ name: "marketId", type: "input", alias: "marketid", inputIndex: 0 },
					{ name: "hasNote", type: "input", alias: "hasnote", inputIndex: 1 },
					{ name: "noteText", type: "input", alias: "notetext", inputIndex: 2 },
					{
						name: "revealTimestamp",
						type: "input",
						alias: "revealtimestamp",
						inputIndex: 3,
					},
				],
				eventName: "MarketResolved(uint256,bool,string,uint256)",
				// Filter will be added conditionally below
			},
		],
		// No groupBy specified in the example
	};

	// 5. Conditionally add the filter if marketId is present in search params
	if (marketId) {
		requestBody.events[0].filter = {
			rule: "and",
			children: [
				{
					rule: "and", // Maintain structure consistency
					children: [
						{
							value: marketId, // Use the extracted marketId
							operator: "Equal",
							fieldType: "input",
							inputIndex: 0, // marketId is index 0 in the event definition
						},
					],
				},
			],
		};
		console.log("Filtering marketResolved by marketId:", marketId);
	}

	try {
		// 6. Make the fetch call to the external MultiBaas API using POST
		console.log(`Posting to MultiBaas for marketResolved: ${externalApiUrl}`);
		const externalResponse = await fetch(externalApiUrl, {
			method: "POST", // Use POST method
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json", // Specify content type
				Accept: "application/json",
			},
			body: JSON.stringify(requestBody), // Include the request body
		});

		// 7. Check if the external API call was successful (HTTP status)
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

		// 8. Get the data and assert the type using the interface
		const data: MultiBaasResponse = await externalResponse.json();

		// 9. Check if the response status indicates success according to the API's body response
		if (data.status !== 200 || data.message !== "success") {
			console.error(
				`MultiBaas returned non-success status in body: Status ${data.status}, Message: ${data.message}`
			);
			return NextResponse.json(
				{ error: `External API indicated failure: ${data.message}` },
				{ status: data.status } // Use status from body if appropriate
			);
		}

		// 10. Send the relevant part of the data (the 'rows') back to the client
		// Adjust processing here if needed based on how you want to use the resolved data
		return NextResponse.json(data.result.rows);
	} catch (error: unknown) {
		console.error("Error in API route (marketResolved):", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: "Internal Server Error", details: errorMessage },
			{ status: 500 }
		);
	}
}

export const dynamic = "force-dynamic"; // Keep dynamic if data should always be fresh
