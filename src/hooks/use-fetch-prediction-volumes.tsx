import { useQuery } from "@tanstack/react-query";

export interface PredictionVolume {
	marketId: string;
	volume: string;
}

interface useFetchPredictionVolumesResponse {
	volumes: PredictionVolume[];
	isFetching: boolean;
}

const PREDICTION_VOLUME_API_URL = "/api/multibaas/predictionVolume";

export const useFetchPredictionVolumes = (
	marketId?: string,
	offset = 0,
	limit = 50
): useFetchPredictionVolumesResponse => {
	const { data, isFetching } = useQuery({
		queryKey: ["predictionVolumes", marketId, offset, limit],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				offset: offset.toString(),
				limit: limit.toString(),
				...(marketId ? { marketId } : {}),
			}).toString();

			const response = await fetch(
				`${PREDICTION_VOLUME_API_URL}?${queryParams}`
			);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch prediction volumes: ${response.statusText}`
				);
			}

			return await response.json();
		},
		refetchOnWindowFocus: false,
	});

	return {
		volumes: data || [],
		isFetching,
	};
};
