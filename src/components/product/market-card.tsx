"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconRosetteDiscountCheckFilled as IconVerified } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface TweetUser {
	name: string;
	screen_name: string;
	profile_image_url_https: string;
	is_blue_verified: boolean;
}

interface TweetProps {
	text: string;
	user: TweetUser;
	created_at: string;
	mediaDetails?: Array<{
		media_url_https: string;
		type: string;
	}>;
	quoted_tweet?: {
		text: string;
		user: TweetUser;
		created_at: string;
		mediaDetails?: Array<{
			media_url_https: string;
			type: string;
		}>;
	};
	conversation_count?: number;
	className?: string;
}

export function MarketCard({
	text,
	user,
	created_at,
	mediaDetails,
	quoted_tweet,
	conversation_count,
	...props
}: TweetProps) {
	return (
		<Card className={cn("@container/card", props.className)} {...props}>
			<CardContent className="">
				<div className="flex items-start gap-3">
					<div className="flex flex-col">
						<div className="flex items-center gap-3">
							<Avatar className="h-[40px] w-[40px]">
								<AvatarImage
									src={user.profile_image_url_https}
									alt={user.name}
								/>
								<AvatarFallback>{user.name[0]}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-[15px]">{user.name}</span>
									{user.is_blue_verified && (
										<IconVerified className="size-5 text-blue-500" />
									)}
								</div>
								<div className="flex items-center gap-2 text-[15px] text-muted-foreground">
									<span>@{user.screen_name}</span>
									<span>·</span>
									<span>
										{formatDistanceToNow(new Date(created_at), {
											addSuffix: true,
										})}
									</span>
								</div>
							</div>
						</div>
						<p className="mt-4 text-[15px] line-clamp-3">{text}</p>
						{mediaDetails?.[0]?.type === "photo" && (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={mediaDetails[0].media_url_https}
								alt="Tweet media"
								className="mt-4 w-full rounded-md object-cover object-center max-h-30"
							/>
						)}

						{quoted_tweet && (
							<Card className="@container/card mt-4">
								<CardContent className="px-4">
									<div className="flex items-center gap-2 flex-wrap">
										<Avatar className="size-[20px]">
											<AvatarImage
												src={quoted_tweet.user.profile_image_url_https}
												alt={quoted_tweet.user.name}
											/>
											<AvatarFallback>
												{quoted_tweet.user.name[0]}
											</AvatarFallback>
										</Avatar>
										<span className="font-semibold">
											{quoted_tweet.user.name}
										</span>
										{quoted_tweet.user.is_blue_verified && (
											<IconVerified className="!size-[20px] text-blue-500" />
										)}
										<span className="text-muted-foreground">
											@{quoted_tweet.user.screen_name}
										</span>
									</div>
									<p className="mt-4 text-[15px] line-clamp-1">
										{quoted_tweet.text}
									</p>
									{/* {quoted_tweet.mediaDetails?.[0]?.type === "photo" && (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={quoted_tweet.mediaDetails[0].media_url_https}
											alt="Tweet media"
											className="mt-4 w-full object-cover object-center"
										/>
									)} */}
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</CardContent>
			<CardFooter className="border-t border-zinc-800 p-4">
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="bg-zinc-900 text-zinc-400">
						{conversation_count} replies
					</Badge>
				</div>
			</CardFooter>
		</Card>
	);
}
