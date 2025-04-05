import { useQuery } from "@tanstack/react-query";

interface MarketRow {
	creationtime: string;
	creator: string;
	deadline: string;
	marketid: string;
	tweetid: string;
}

interface MarketResult {
	rows: MarketRow[];
}

interface FetchMarketsOptions {
	offset?: number;
	limit?: number;
}

const MARKET_CREATED_API_URL = "/api/multibaas/marketCreated";

export const useFetchMarkets = ({
	offset = 0,
	limit = 50,
}: FetchMarketsOptions = {}) => {
	const query = useQuery({
		queryKey: ["markets", offset, limit],
		queryFn: async (): Promise<MarketResult> => {
			const queryParams = new URLSearchParams({
				offset: offset.toString(),
				limit: limit.toString(),
			}).toString();

			const response = await fetch(`${MARKET_CREATED_API_URL}?${queryParams}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch markets: ${response.statusText}`);
			}

			return response.json();
		},
		refetchOnWindowFocus: false,
	});

	return {
		...query,
		markets: query.data?.rows || [],
		isFetching: query.isFetching,
	};
};
