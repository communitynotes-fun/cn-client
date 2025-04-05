"use client";

import predictionData from "@/app/prediction-data.json";
import { MarketCard } from "@/components/product/market-card";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MarketPredictionsTable } from "@/components/product/market-predictions-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IconArrowLeft, IconExternalLink } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { SubmitPredictionModal } from "@/components/modals/submit-prediction";
import { PredictNoNoteModal } from "@/components/modals/predict-no-note";
import { formatDistanceToNow } from "date-fns";
export default function Page({
	params,
}: {
	params: Promise<{ tweetId: string }>;
}) {
	const tweetData = {
		id_str: "1718625872909869056",
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
		myPosition: 30,
		myPayout: 45,
		isOutcomeNoCommunityNote: true,
		isOutcomeWillGetCommunityNote: false,
		pnl: 15,
	};

	const isMyPayoutNegative = data.myPayout < 0;

	const router = useRouter();

	const onClickBack = () => {
		router.back();
	};

	return (
		<div className="@container/main flex flex-1 flex-col">
			<Button
				onClick={onClickBack}
				variant="ghost"
				size="sm"
				className="mx-4 w-fit gap-2 pl-2 text-muted-foreground hover:text-foreground py-1 mt-3"
			>
				<IconArrowLeft className="size-4" />
				Back to markets
			</Button>
			<div className="flex flex-col gap-4 p-4 @5xl:flex-row">
				<div className="flex flex-col gap-4 @5xl:min-w-[320px] @5xl:max-w-[400px]">
					<MarketCard {...tweetData} className="h-fit" />
				</div>
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
										<span className="text-card-foreground">3,000 USDC</span>
									</Badge>
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start border-l-0"
									>
										Participants
										<span className="text-card-foreground">12</span>
									</Badge>
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start border-l-0"
									>
										PnL
										<span
											className={cn(
												"text-card-foreground",
												data.pnl > 0 ? "text-green-500" : "text-red-500"
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
										{data.myPosition > 0 && (
											<Badge
												variant="outline"
												className={cn(
													"text-muted-foreground px-3 py-1 mb-3 h-[24px]"
												)}
											>
												Position: {Math.abs(data.myPosition)} USDC
											</Badge>
										)}
										{data.myPayout > 0 && (
											<Badge
												variant="outline"
												className={cn(
													"text-muted-foreground px-3 py-1 mb-3 h-[24px]",
													isMyPayoutNegative ? "text-red-500" : "text-green-500"
												)}
											>
												Payout: {isMyPayoutNegative ? "-" : "+"}
												{Math.abs(data.myPayout)} USDC
											</Badge>
										)}
									</div>
									<PredictNoNoteModal {...tweetData} />
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
										<span className="text-card-foreground">3,000 USDC</span>
									</Badge>
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start border-l-0"
									>
										Participants
										<span className="text-card-foreground">12</span>
									</Badge>
									<Badge
										variant="outline"
										className="text-muted-foreground p-3 w-full flex flex-col gap-2 items-start border-l-0"
									>
										PnL
										<span
											className={cn(
												"text-card-foreground",
												data.pnl > 0 ? "text-green-500" : "text-red-500"
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
									Choose from existing predictions or
								</div>
								<SubmitPredictionModal {...tweetData} />
							</CardFooter>
						</Card>
					</div>
					<Card className="@container/card">
						<CardHeader className="flex justify-between items-start flex-wrap gap-2">
							<CardTitle className="text-sm font-semibold">
								Official Community Note
							</CardTitle>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Button variant="ghost" className="!gap-2" size="sm">
									Open in X <IconExternalLink className="size-6" />
								</Button>
							</a>
						</CardHeader>
						<CardContent className="text-sm">
							While AI progress has been significant in specific domains like
							language models and image generation, many experts note that
							advancement in areas like reasoning, robustness, and general
							intelligence faces substantial challenges. The pace of progress
							varies considerably across different aspects of AI research.
						</CardContent>
						<CardFooter>
							<span className="text-muted-foreground text-sm">
								Added on{" "}
								{formatDistanceToNow(new Date("2025-04-03"), {
									addSuffix: true,
								})}
							</span>
						</CardFooter>
					</Card>
					<MarketPredictionsTable data={predictionData} className="w-full" />
				</div>
			</div>
		</div>
	);
}
