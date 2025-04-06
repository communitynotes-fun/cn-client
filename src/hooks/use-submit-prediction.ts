import { useState } from "react";
import {
	useAccount,
	useWriteContract,
	useWaitForTransactionReceipt,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useWallets } from "@privy-io/react-auth";
import { useQueryClient } from "@tanstack/react-query";
import { getConfig } from "@/components/provider/wagmi-provider";
import { getChainIdFromCAIP2 } from "@/lib/utils";
import { polygon } from "viem/chains";
import { toast } from "sonner";
import { cnMarketAbi } from "@/lib/abi/cn_market";
import { contractAddresses } from "@/lib/config";

export function useSubmitPrediction(onSubmitSuccess: () => void) {
	const { wallets } = useWallets();

	const [isLoading, setIsLoading] = useState(false);
	const { address } = useAccount();
	const queryClient = useQueryClient();

	const config = getConfig(polygon.id);

	const isInWrongNetwork =
		getChainIdFromCAIP2(wallets[0]?.chainId) !== polygon.id;

	const { writeContractAsync: submitPredictionAsync } = useWriteContract();

	const [submitPredictionHash, setSubmitPredictionHash] = useState<
		`0x${string}` | undefined
	>();

	const { isLoading: isSubmitPredictionConfirming } =
		useWaitForTransactionReceipt({
			hash: submitPredictionHash,
		});

	const handleSubmitPrediction = async (
		marketId: string,
		reasonText: string,
		reasonEmbedding: Uint8Array,
		stakeAmount: bigint
	) => {
		if (!address) {
			toast("Connect your wallet to submit a prediction");
			return;
		}

		if (isInWrongNetwork && polygon.id) {
			toast("Please switch to the Polygon network to submit a prediction");
			return;
		}

		try {
			setIsLoading(true);

			console.log("stakeAmount", stakeAmount);
			console.log("reasonText", reasonText);
			console.log("reasonEmbedding", reasonEmbedding);
			console.log("marketId", marketId);

			const submitTx = await submitPredictionAsync({
				address: contractAddresses.polygon.cnMarket as `0x${string}`,
				abi: cnMarketAbi,
				functionName: "predict",
				args: [marketId, false, reasonText, reasonEmbedding],
				value: stakeAmount,
			});

			setSubmitPredictionHash(submitTx);
			toast("Submitting prediction...");

			const submitReceipt = await waitForTransactionReceipt(config, {
				hash: submitTx,
			});

			if (!submitReceipt || !submitReceipt.status) {
				throw new Error(
					`Prediction submission failed for Market ID: ${marketId}`
				);
			}

			toast("Successfully submitted prediction");

			onSubmitSuccess();

			await queryClient.invalidateQueries({
				queryKey: ["covenant-info"],
			});
		} catch (err) {
			console.error("Prediction submission error:", err);
			let errorMessage = "Failed to submit prediction. Please try again.";

			if (err instanceof Error) {
				if (err.message.includes("rejected")) {
					errorMessage = "User rejected the transaction. Please try again.";
				} else if (err.message.includes("insufficient")) {
					errorMessage = "Insufficient balance to complete the transaction.";
				} else if (err.message.includes("already submitted")) {
					errorMessage =
						"You have already submitted a prediction for this market.";
				}
			}

			toast.error(errorMessage);

			setSubmitPredictionHash(undefined);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		handleSubmitPrediction,
		isLoading: isLoading || isSubmitPredictionConfirming,
	};
}
