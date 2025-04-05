import { polygon } from "viem/chains";

export const networks = {
	polygon: {
		iconUrl: "/images/chains/polygon.svg",
		...polygon,
	},
};

export function getNetworkByChainId(chainId: number) {
	const networkName = Object.keys(networks).find(
		(name) => networks[name as keyof typeof networks].id === chainId
	);
	return networkName
		? networks[networkName as keyof typeof networks]
		: undefined;
}

export function isInSupportedNetwork(chainId: number | undefined) {
	if (!chainId) return false;
	return Object.keys(networks).some(
		(name) => networks[name as keyof typeof networks].id === chainId
	);
}
