import { useQuery } from "@tanstack/react-query";

interface PredictionMade {
	marketId: string;
	predictionId: string;
	predictor: string;
	isAgree: boolean;
	value: string;
}

interface useFetchPredictionsResponse {
	predictions: PredictionMade[];
	isFetching: boolean;
}

const PREDICTION_MADE_API_URL = "/api/multibaas/predictionMades";

export const useFetchPredictions = (
	marketId?: string,
	offset = 0,
	limit = 50
): useFetchPredictionsResponse => {
	const { data, isFetching } = useQuery({
		queryKey: ["predictions"],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				offset: offset.toString(),
				limit: limit.toString(),
				marketId: marketId || "",
			}).toString();

			const response = await fetch(`${PREDICTION_MADE_API_URL}?${queryParams}`);

			const responseData = await response.json();

			return responseData;
		},
		refetchOnWindowFocus: false,
	});

	return {
		predictions: data || [],
		isFetching,
	};
};
