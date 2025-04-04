import predictionData from "@/app/prediction-data.json";
import { MarketCard } from "@/components/product/market-card";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MarketPredictionsTable } from "@/components/product/market-predictions-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export default function Page({
	params,
}: {
	params: {
		tweetId: string;
	};
}) {
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
		status: "Ongoing",
		volume: 3000,
		participants: 12,
		endTime: "2025-04-07T00:43:01.000Z",
	};

	const data = {
		myBet: 30,
		myPayout: 45,
		isOutcomeNoCommunityNote: true,
		isOutcomeWillGetCommunityNote: false,
		pnl: 15,
	};

	const isMyPayoutNegative = data.myPayout < 0;

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="flex flex-col gap-4 p-4 @5xl:flex-row">
				<MarketCard
					{...tweetData}
					className="@5xl:min-w-[320px] @5xl:max-w-[400px] h-fit"
				/>
				<div className="flex flex-col gap-4">
					<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2">
						<Card className="@container/card">
							<CardHeader className="h-full">
								<CardTitle className="text-lg font-semibold">
									No Community Note
								</CardTitle>
								<div className="mt-2 grid grid-cols-3">
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start"
									>
										Volume
										<span className="text-white">3,000 USDC</span>
									</Badge>
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start border-l-0"
									>
										Participants
										<span className="text-white">12</span>
									</Badge>
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start border-l-0"
									>
										PnL
										<span
											className={cn(
												"text-white",
												data.pnl > 0 ? "text-green-400" : "text-red-400"
											)}
										>
											{data.pnl > 0 ? "+" : "-"}
											{Math.abs(data.pnl)} USDC
										</span>
									</Badge>
								</div>
							</CardHeader>
							<CardFooter>
								<div className="w-full">
									<div className="flex gap-2 flex-wrap">
										{data.myBet > 0 && (
											<Badge
												variant="outline"
												className={cn(
													"text-muted-foreground px-3 py-1 mb-3 h-[24px]"
												)}
											>
												My Bet: {Math.abs(data.myBet)} USDC
											</Badge>
										)}
										{data.myPayout > 0 && (
											<Badge
												variant="outline"
												className={cn(
													"text-muted-foreground px-3 py-1 mb-3 h-[24px]",
													isMyPayoutNegative ? "text-red-400" : "text-green-400"
												)}
											>
												Payout: {isMyPayoutNegative ? "-" : "+"}
												{Math.abs(data.myPayout)} USDC
											</Badge>
										)}
									</div>
									<Button
										variant="outline"
										size="lg"
										className="w-full h-[35px]"
									>
										Bet
									</Button>
								</div>
							</CardFooter>
						</Card>

						<Card className="@container/card">
							<CardHeader className="h-full">
								<CardTitle className="text-lg font-semibold">
									Will Get Community Note
								</CardTitle>
								<div className="mt-2 grid grid-cols-3">
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start"
									>
										Volume
										<span className="text-white">3,000 USDC</span>
									</Badge>
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start border-l-0"
									>
										Participants
										<span className="text-white">12</span>
									</Badge>
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start border-l-0"
									>
										PnL
										<span
											className={cn(
												"text-white",
												data.pnl > 0 ? "text-green-400" : "text-red-400"
											)}
										>
											{data.pnl > 0 ? "+" : "-"}
											{Math.abs(data.pnl)} USDC
										</span>
									</Badge>
								</div>
							</CardHeader>
							<CardFooter className="flex flex-col items-start">
								<div className="text-sm text-muted-foreground mb-3 h-[24px]">
									Bet on existing predictions or
								</div>
								<Button variant="outline" size="lg" className="w-full h-[35px]">
									Submit New Prediction
								</Button>
							</CardFooter>
						</Card>
					</div>
					<MarketPredictionsTable data={predictionData} className="w-full" />
				</div>
			</div>
		</div>
	);
}
