"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { polygon } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
	const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
	return (
		<PrivyProvider
			appId={appId}
			config={{
				appearance: {
					accentColor: "#383838",
					theme: "#FFFFFF",
					showWalletLoginFirst: false,
					walletChainType: "ethereum-only",
				},
				defaultChain: polygon,
				supportedChains: [polygon],
				loginMethods: ["wallet"],
				fundingMethodConfig: {
					moonpay: {
						useSandbox: true,
					},
				},
				embeddedWallets: {
					createOnLogin: "users-without-wallets",
					requireUserPasswordOnCreate: false,
					showWalletUIs: true,
				},
				mfa: {
					noPromptOnMfaRequired: false,
				},
			}}
		>
			{children}
		</PrivyProvider>
	);
}
