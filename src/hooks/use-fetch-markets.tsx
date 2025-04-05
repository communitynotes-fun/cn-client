import { useQuery } from "@tanstack/react-query";
import { Market } from "@/lib/types/market";
import { tokens } from "@/lib/constants";
import { formatUnits } from "viem";

interface useFetchMarketsResponse {
	markets: Market[];
	isFetching: boolean;
}

const MARKET_CREATED_API_URL = "/api/multibaas/marketCreated";
const MARKET_VOLUME_API_URL = "/api/multibaas/marketVolume";
const MARKET_PARTICIPANTS_API_URL = "/api/multibaas/marketParticipants";

const TWITTER_CDN_URL = "/api/tweet/";

export const useFetchTweet = (tweetId: string) => {
	const { data, isFetching } = useQuery({
		queryKey: ["tweet", tweetId],
		queryFn: async () => {
			const response = await fetch(`${TWITTER_CDN_URL}${tweetId}`);
			const data = await response.json();
			return data;
		},
	});

	return {
		tweet: data,
		isFetching,
	};
};

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

					const volumeResponse = await fetch(
						`${MARKET_VOLUME_API_URL}?${queryParams}`
					);
					const volumeData = await volumeResponse.json();
					const volumeMatch = volumeData.find(
						(v: { marketid: string }) => v.marketid === market.marketid
					);

					const volume = formatUnits(
						volumeMatch?.volume || "0",
						tokens.ETH.decimals
					);

					const participantsResponse = await fetch(
						`${MARKET_PARTICIPANTS_API_URL}?${queryParams}`
					);
					const participantsData = await participantsResponse.json();
					const participantsMatch = participantsData.find(
						(p: { marketid: string }) => p.marketid === market.marketid
					);

					const participants = participantsMatch?.participants || 0;

					return {
						...market,
						tweet: tweetData,
						volume,
						participants,
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
