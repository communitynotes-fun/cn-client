"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	IconExternalLink,
	IconRosetteDiscountCheckFilled as IconVerified,
} from "@tabler/icons-react";
import { formatDistanceToNow, intervalToDuration } from "date-fns";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { useState, useEffect } from "react";
import { TweetProps } from "@/lib/types/tweet";
import { Button } from "../ui/button";
import { tokens } from "@/lib/constants";

export function MarketCard({
	market,
	variant = "default",
	...props
}: TweetProps) {
	const [duration, setDuration] = useState(() =>
		intervalToDuration({
			start: new Date(),
			end: new Date(market?.deadline ? Number(market.deadline) * 1000 : ""),
		})
	);

	useEffect(() => {
		const timer = setInterval(() => {
			setDuration(
				intervalToDuration({
					start: new Date(),
					end: new Date(market?.deadline ? Number(market.deadline) * 1000 : ""),
				})
			);
		}, 1000);

		return () => clearInterval(timer);
	}, [market?.deadline]);

	return (
		<Card className={cn("@container/card", props.className)} {...props}>
			<CardContent className="h-full">
				<div className="flex items-start gap-3">
					<div className="flex flex-col w-full">
						<div className="flex items-center gap-3 justify-between">
							<div className="flex items-center gap-3">
								<Avatar className="h-[40px] w-[40px]">
									<AvatarImage
										src={market?.tweet.user.profile_image_url_https}
										alt={market?.tweet.user.name}
									/>
									<AvatarFallback>{market?.tweet.user.name[0]}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-sm">
											{market?.tweet.user.name}
										</span>
										{market?.tweet.user.is_blue_verified && (
											<IconVerified className="size-5 text-blue-500" />
										)}
									</div>
									<div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
										<span>@{market?.tweet.user.screen_name}</span>
										<span>·</span>
										{market && (
											<span>
												{formatDistanceToNow(
													new Date(market?.tweet.created_at),
													{
														addSuffix: true,
													}
												)}
											</span>
										)}
									</div>
								</div>
							</div>
							{variant === "default" && market?.tweet.id_str && (
								<a
									href={`https://twitter.com/${market?.tweet.user.screen_name}/status/${market?.tweet.id_str}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									<Button variant="ghost" size="sm">
										<IconExternalLink className="size-6" />
									</Button>
								</a>
							)}
						</div>
						<p
							className={cn(
								"mt-4 text-sm",
								variant === "compact" && "line-clamp-2"
							)}
						>
							{market?.tweet.text}
						</p>
						{market?.tweet.mediaDetails?.[0]?.type === "photo" && (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={market?.tweet.mediaDetails[0].media_url_https}
								alt="Tweet media"
								className={cn(
									"mt-4 w-full rounded-md object-cover object-center",
									variant === "compact" ? "max-h-30" : "max-h-60"
								)}
							/>
						)}

						{market?.tweet.quoted_tweet && (
							<Card className="@container/card mt-4">
								<CardContent className="px-4">
									<div className="flex items-center gap-2 flex-wrap">
										<Avatar className="size-[20px]">
											<AvatarImage
												src={
													market?.tweet.quoted_tweet.user
														.profile_image_url_https
												}
												alt={market?.tweet.quoted_tweet.user.name}
											/>
											<AvatarFallback>
												{market?.tweet.quoted_tweet.user.name[0]}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm font-semibold">
											{market?.tweet.quoted_tweet.user.name}
										</span>
										{market?.tweet.quoted_tweet.user.is_blue_verified && (
											<IconVerified className="!size-[20px] text-blue-500" />
										)}
										<span className="text-sm text-muted-foreground">
											@{market?.tweet.quoted_tweet.user.screen_name}
										</span>
									</div>
									<p
										className={cn(
											"mt-4 text-sm",
											variant === "compact" && "line-clamp-1"
										)}
									>
										{market?.tweet.quoted_tweet.text}
									</p>
									{variant === "default" &&
										market?.tweet.quoted_tweet.mediaDetails?.[0]?.type ===
											"photo" && (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={
													market?.tweet.quoted_tweet.mediaDetails[0]
														.media_url_https
												}
												alt="Tweet media"
												className="mt-4 w-full object-cover object-center max-h-60"
											/>
										)}
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</CardContent>
			{/* {variant === "compact" && (
				<div className="border-t border-muted-foreground/20 px-6 pt-6">
					<div className="grid grid-cols-2 w-full">
						<Badge
							variant="outline"
							className="text-yellow-500 py-2 px-3 pr-6 flex items-center justify-start gap-4 w-full transition-all duration-300 hover:bg-yellow-500/20 bg-yellow-500/10"
						>
							<span className="text-yellow-500 w-full break-words text-wrap">
								No Community Note
							</span>
							<span className="text-yellow-500">30%</span>
						</Badge>
						<Badge
							variant="outline"
							className="text-green-500 py-2 px-3 pr-6 flex items-center justify-start gap-4 w-full border-l-0 transition-all duration-300 hover:bg-blue-500/20 bg-blue-500/10"
						>
							<span className="text-blue-500 w-full break-words text-wrap">
								Will Get Community Note
							</span>
							<span className="text-blue-500">70%</span>
						</Badge>
					</div>
				</div>
			)} */}
			<CardFooter className="border-t border-muted-foreground/20 px-6 flex flex-col gap-4 items-start">
				<div className="flex items-center gap-3">
					<StatusBadge status={market?.status || "ongoing"} />
					<span className="text-sm text-muted-foreground">
						{`${duration.hours ?? 0}h ${duration.minutes ?? 0}m ${
							duration.seconds ?? 0
						}s until final resolution`}
					</span>
				</div>
				<div className="grid grid-cols-2 w-full">
					<Badge
						variant="outline"
						className="text-muted-foreground py-3 px-3 pr-6  flex gap-3 items-start w-full"
					>
						Volume
						<span className="text-card-foreground">
							{market?.volume} {tokens.POL.symbol}
						</span>
					</Badge>
					<Badge
						variant="outline"
						className="text-muted-foreground py-3 px-3 pr-6 flex gap-3 items-start w-full border-l-0"
					>
						Participants
						<span className="text-card-foreground">{market?.participants}</span>
					</Badge>
				</div>
			</CardFooter>
		</Card>
	);
}
