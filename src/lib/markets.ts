import { PredictionMade } from "@/hooks/use-fetch-predictions";

export const processPredictionData = (predictionData: PredictionMade[]) => {
	const processedData = predictionData.map((prediction) => {
		return {
			...prediction,
		};
	});
};
