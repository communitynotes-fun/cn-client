import { NextRequest, NextResponse } from "next/server";

type Params = {
	params: Promise<{
		id: string;
	}>;
};

export async function GET(request: NextRequest, props: Params) {
	const params = await props.params;

	try {
		const tweetId = params.id;

		// Construct the Twitter CDN URL
		const tweetUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&token=!`;

		// Fetch the tweet data
		const response = await fetch(tweetUrl, {
			headers: {
				Accept: "application/json",
			},
			next: { revalidate: 3600 }, // Cache for 1 hour
		});

		// Check if the fetch was successful
		if (!response.ok) {
			console.error(`Failed to fetch tweet: ${response.status}`);
			return NextResponse.json(
				{ error: `Failed to fetch tweet: ${response.statusText}` },
				{ status: response.status }
			);
		}

		// Parse and return the tweet data
		const tweetData = await response.json();
		return NextResponse.json(tweetData);
	} catch (error) {
		console.error("Error fetching tweet:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
