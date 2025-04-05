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

export function useCreateMarket(onCreateMarketSuccess: () => void) {
	const { wallets } = useWallets();

	const [isLoading, setIsLoading] = useState(false);
	const { address } = useAccount();
	const queryClient = useQueryClient();

	const config = getConfig(polygon.id);

	const isInWrongNetwork =
		getChainIdFromCAIP2(wallets[0]?.chainId) !== polygon.id;

	const { writeContractAsync: createMarket } = useWriteContract();

	const [createMarketHash, setCreateMarketHash] = useState<
		`0x${string}` | undefined
	>();

	const { isLoading: isCreateMarketConfirming } = useWaitForTransactionReceipt({
		hash: createMarketHash,
	});

	const handleCreateMarket = async (tweetId: string) => {
		if (!address) {
			toast("Connect your wallet to make a purchase");
			return;
		}

		if (isInWrongNetwork && polygon.id) {
			toast("Please switch to the Polygon network to make a purchase");
			return;
		}

		try {
			setIsLoading(true);

			const createMarketTx = await createMarket({
				address: contractAddresses.polygon.cnMarket as `0x${string}`,
				abi: cnMarketAbi,
				functionName: "createMarket",
				args: [tweetId],
			});

			setCreateMarketHash(createMarketTx);
			toast("Creating market...");

			const createMarketReceipt = await waitForTransactionReceipt(config, {
				hash: createMarketTx,
			});

			if (!createMarketReceipt || !createMarketReceipt.status) {
				throw new Error(`Market creation failed for Tweet ID: ${tweetId}`);
			}

			toast("Successfully created market");

			onCreateMarketSuccess();

			await queryClient.invalidateQueries({
				queryKey: ["covenant-info"],
			});
		} catch (err) {
			console.error("Market creation error:", err);
			let errorMessage = "Failed to create market. Please try again.";

			if (err instanceof Error) {
				if (err.message.includes("rejected")) {
					errorMessage = "User rejected the transaction. Please try again.";
				} else if (err.message.includes("insufficient")) {
					errorMessage = "Insufficient balance to complete the transaction.";
				} else if (err.message.includes("NFT purchase")) {
					errorMessage = err.message;
				}
			}

			toast.error(errorMessage);

			setCreateMarketHash(undefined);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		handleCreateMarket,
		isLoading: isLoading || isCreateMarketConfirming,
	};
}
