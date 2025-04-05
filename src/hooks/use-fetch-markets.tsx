import { useQuery } from "@tanstack/react-query";
import { Market } from "@/lib/types/market";

interface useFetchMarketsResponse {
	markets: Market[];
	isFetching: boolean;
}

const MARKET_CREATED_API_URL = "/api/multibaas/marketCreated";
const TWITTER_CDN_URL = "/api/tweet/";

export const useFetchMarkets = (
	offset = 0,
	limit = 50
): useFetchMarketsResponse => {
	const { data, isFetching } = useQuery({
		queryKey: ["markets"],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				offset: offset.toString(),
				limit: limit.toString(),
			}).toString();

			const response = await fetch(`${MARKET_CREATED_API_URL}?${queryParams}`);

			const responseData = await response.json();
			const dataWithTweet = await Promise.all(
				responseData.map(async (market: Market) => {
					const tweetUrl = `${TWITTER_CDN_URL}${market.tweetid}`;

					const tweetResponse = await fetch(tweetUrl);
					const tweetData = await tweetResponse.json();

					return {
						...market,
						tweet: tweetData,
					};
				})
			);

			return dataWithTweet;
		},
		refetchOnWindowFocus: false,
	});

	return {
		markets: data || [],
		isFetching,
	};
};
