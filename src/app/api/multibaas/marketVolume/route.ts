import { NextRequest, NextResponse } from "next/server";

// --- Updated Interfaces ---

// Interface for each object within the 'rows' array
interface MarketVolumeRow {
	marketid: string;
	volume: string;
}

// Interface for the nested 'result' object
interface MultiBaasResult {
	rows: MarketVolumeRow[];
	// Add other fields within 'result' if they exist, e.g., 'count', 'offset', etc.
}

// Interface for the overall API response structure
interface MultiBaasResponse {
	status: number;
	message: string;
	result: MultiBaasResult;
}

// Interface for query event configuration
interface QueryEvent {
	select: Array<{
		name: string;
		type: string;
		alias: string;
		inputIndex: number;
		aggregator?: string;
	}>;
	eventName: string;
	filter?: {
		name: string;
		type: string;
		inputIndex: number;
		value: string;
		operator: string;
	};
}

// Interface for query body
interface QueryBody {
	events: QueryEvent[];
	groupBy: string;
}

// --- End of Updated Interfaces ---

export async function GET(request: NextRequest) {
	console.log("Fetching marketVolume from MultiBaas");
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
	const marketId = searchParams.get("marketId");
	const isAgree = searchParams.get("isAgree");
	// 3. Construct the query body with the provided configuration
	const queryBody: QueryBody = {
		events: [
			{
				select: [
					{
						name: "marketId",
						type: "input",
						alias: "",
						inputIndex: 0,
					},
					{
						name: "value",
						type: "input",
						alias: "volume",
						aggregator: "add",
						inputIndex: 4,
					},
				],
				eventName:
					"PredictionMade(uint256,uint256,address,bool,uint256,uint256)",
			},
		],
		groupBy: "marketId",
	};

	// Add filter if marketId is provided
	if (marketId) {
		queryBody.events[0].filter = {
			name: "marketId",
			type: "input",
			inputIndex: 0,
			value: marketId,
			operator: "Equal",
		};
	}

	if (isAgree) {
		queryBody.events[0].filter = {
			name: "isAgree",
			type: "input",
			inputIndex: 3,
			value: isAgree,
			operator: "Equal",
		};
	}

	// 4. Construct the query parameters for the external API call
	const queryParams = new URLSearchParams({ offset, limit }).toString();

	// 5. Define the external API details
	const hostname =
		process.env.CURVEGRID_APP_DEPLOYMENT_HOST?.replace("/api/v0", "").replace(
			"https://",
			""
		) || "jxutqneljbdfnbq47xrwy2632m.multibaas.com";
	const externalApiUrl = `https://${hostname}/api/v0/queries?${queryParams}`;

	try {
		// 6. Make the fetch call to the external MultiBaas API
		console.log(`Fetching from MultiBaas: ${externalApiUrl}`);
		const externalResponse = await fetch(externalApiUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(queryBody),
			// cache: 'no-store', // Optional: Uncomment to disable fetch caching
		});

		// 7. Check if the external API call was successful
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

		// 8. Get the data and assert the type using the new interface
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

		// 9. Send the relevant part of the data (the 'result' object) back to your frontend client
		return NextResponse.json(data.result.rows);
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
