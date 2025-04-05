"use client";

import { MarketCard } from "@/components/product/market-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useFetchMarkets } from "@/hooks/use-fetch-markets";
import { useCreateMarket } from "@/hooks/use-create-market";
export default function Page() {
	const [open, setOpen] = useState(false);
	const [tweetId, setTweetId] = useState("");

	const [nonce, setNonce] = useState(0);
	const { handleCreateMarket, isLoading } = useCreateMarket(() => {
		setNonce(nonce + 1);
		setOpen(false);
	});

	const tweetData = {
		text: "This was done in the name of working class populism, but there is no way in hell the working class voted for this.",
		created_at: "2025-04-03T00:43:01.000Z",
		user: {
			name: "Patrick Ruffini",
			screen_name: "PatrickRuffini",
			profile_image_url_https:
				"https://pbs.twimg.com/profile_images/1718625872909869056/JIV9qkJs_normal.jpg",
			is_blue_verified: true,
		},
		mediaDetails: [
			{
				type: "photo",
				media_url_https: "https://pbs.twimg.com/media/Gnkf8DjXsAAO6fj.png",
			},
		],
		quoted_tweet: {
			text: "This from JPMorgan is bad, bad, bad not good hello",
			created_at: "2025-04-03T00:28:49.000Z",
			user: {
				name: "James Pethokoukis ⏩️⤴️",
				screen_name: "JimPethokoukis",
				profile_image_url_https:
					"https://pbs.twimg.com/profile_images/1689426056145444865/Xl3MTIOa_normal.jpg",
				is_blue_verified: true,
			},
			mediaDetails: [
				{
					type: "photo",
					media_url_https: "https://pbs.twimg.com/media/Gnkf8DjXsAAO6fj.png",
				},
			],
		},
		conversation_count: 487,
		status: "Resolved",
		volume: 3000,
		participants: 12,
		endTime: "2025-04-05T00:43:01.000Z",
	};

	const { ready, authenticated } = usePrivy();

	const { markets, isFetching } = useFetchMarkets();

	console.log("markets", markets);

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<div className="flex items-center justify-between px-4 lg:px-6">
					<h1 className="text-xl font-semibold md:text-2xl">Markets</h1>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button
								className="disabled:bg-primary"
								disabled={!ready || !authenticated}
							>
								Create Market
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Create New Market</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center">
									<Label htmlFor="tweetId" className="text-right">
										Tweet ID
									</Label>
									<Input
										id="tweetId"
										value={tweetId}
										onChange={(e) => setTweetId(e.target.value)}
										className="col-span-3"
										placeholder="Enter Tweet ID or URL"
									/>
								</div>
							</div>
							<Button
								onClick={() => {
									handleCreateMarket(tweetId);
								}}
								disabled={isLoading}
							>
								{isLoading ? "Creating..." : "Create Market"}
							</Button>
						</DialogContent>
					</Dialog>
				</div>
				<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
					{isFetching ? (
						<div>Loading...</div>
					) : markets && markets.length > 0 ? (
						markets.map((market) => (
							<Link
								href={`/market/${market.tweet.id_str}`}
								key={market.marketid}
							>
								<MarketCard
									market={market}
									{...tweetData}
									variant="compact"
									className="h-full"
								/>
							</Link>
						))
					) : (
						<div>No markets found</div>
					)}
				</div>
			</div>
		</div>
	);
}
