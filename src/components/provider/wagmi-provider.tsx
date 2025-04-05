"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { polygon, mainnet } from "viem/chains";

type ChainId = 137 | 1;

const TRANSPORTS: Record<ChainId, ReturnType<typeof http>> = {
	[polygon.id]: http(),
	[mainnet.id]: http(),
};

const config = createConfig({
	chains: [polygon, mainnet],
	transports: {
		[polygon.id]: http(),
		[mainnet.id]: http(),
	},
});

const createCustomConfig = (chain: typeof polygon) =>
	createConfig({
		chains: [chain],
		transports: {
			[chain.id]: http(),
		},
		ssr: true,
	});

export const getConfig = (chainId: number | undefined) => {
	switch (chainId) {
		case polygon.id:
			return createCustomConfig(polygon);
		default:
			return createCustomConfig(polygon);
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
