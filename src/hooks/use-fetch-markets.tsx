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

const MARKET_RESOLVED_API_URL = "/api/multibaas/marketResolved";

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
	tweetId?: string,
	offset = 0,
	limit = 50
): useFetchMarketsResponse => {
	const { data, isFetching } = useQuery({
		queryKey: ["markets"],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				offset: offset.toString(),
				limit: limit.toString(),
				tweetId: tweetId || "",
			}).toString();

			const response = await fetch(`${MARKET_CREATED_API_URL}?${queryParams}`);

			const responseData = await response.json();
			const dataWithTweet = await Promise.all(
				responseData.map(async (market: Market) => {
					const tweetUrl = `${TWITTER_CDN_URL}${market.tweetid}`;

					const tweetResponse = await fetch(tweetUrl);
					const tweetData = await tweetResponse.json();

					const volumeResponse = await fetch(
						`${MARKET_VOLUME_API_URL}?marketId=${market.marketid}`
					);

					const volumeData = await volumeResponse.json();

					const volume = formatUnits(
						volumeData[0]?.volume || "0",
						tokens.POL.decimals
					);

					const participantsResponse = await fetch(
						`${MARKET_PARTICIPANTS_API_URL}?marketId=${market.marketid}`
					);
					const participantsData = await participantsResponse.json();

					const participants = participantsData[0]?.participants || 0;

					const marketResolvedResponse = await fetch(
						`${MARKET_RESOLVED_API_URL}?${queryParams}`
					);
					const marketResolvedData = await marketResolvedResponse.json();
					const marketResolvedMatch = marketResolvedData.find(
						(p: { marketid: string }) => p.marketid === market.marketid
					);

					const status = marketResolvedMatch ? "ongoing" : "resolved";

					return {
						...market,
						tweet: tweetData,
						volume,
						participants,
						status,
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
