"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { baseSepolia, mainnet } from "viem/chains";

type ChainId = 84532;

const TRANSPORTS: Record<ChainId, ReturnType<typeof http>> = {
	[baseSepolia.id]: http(),
};

const config = createConfig({
	chains: [baseSepolia, mainnet],
	transports: {
		[baseSepolia.id]: http(),
		[mainnet.id]: http(),
	},
});

const createCustomConfig = (chain: typeof baseSepolia) =>
	createConfig({
		chains: [chain],
		transports: {
			[chain.id as ChainId]: TRANSPORTS[chain.id as ChainId],
		},
		ssr: true,
	});

export const getConfig = (chainId: number | undefined) => {
	switch (chainId) {
		case baseSepolia.id:
			return createCustomConfig(baseSepolia);
		default:
			return createCustomConfig(baseSepolia);
	}
};

const queryClient = new QueryClient();

export default function WagmiProviderWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={config}>{children}</WagmiProvider>
		</QueryClientProvider>
	);
}
