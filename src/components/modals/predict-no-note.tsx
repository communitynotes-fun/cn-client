"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { TweetProps } from "@/lib/types/tweet";
import { IconRosetteDiscountCheckFilled as IconVerified } from "@tabler/icons-react";

export function PredictNoNoteModal({
	text,
	user,
	created_at,
	mediaDetails,
	quoted_tweet,
	conversation_count,
	status,
	volume,
	participants,
	endTime,
	...props
}: TweetProps) {
	const [stakeAmount, setStakeAmount] = useState(25);
	const prediction =
		"While AI progress has been rapid in some areas like language models, many experts caution that advancements are slower in areas like reasoning and general intelligence.";
	const balance = 250;

	const increaseStake = (amount: number) => {
		setStakeAmount((prev) => Math.min(prev + amount, balance));
	};

	const setMaxStake = () => {
		setStakeAmount(balance);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="lg" className="w-full h-[35px]">
					Predict
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Predict No Community Note</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<p className="text-sm">
						You are predicting that this tweet will NOT receive a Community
						Note:
					</p>
					<Card className="p-4 bg-muted/50 flex flex-col gap-2">
						<div className="flex items-center gap-2 flex-wrap">
							<Avatar className="size-[20px] rounded-full overflow-hidden">
								<AvatarImage
									src={user.profile_image_url_https}
									alt={user.name}
								/>
								<AvatarFallback>{user.name[0]}</AvatarFallback>
							</Avatar>
							<span className="text-sm font-semibold">{user.name}</span>
							{user.is_blue_verified && (
								<IconVerified className="!size-[16px] text-blue-500" />
							)}
							<span className="text-sm text-muted-foreground">
								@{user.screen_name}
							</span>
						</div>
						<p className="text-sm line-clamp-2">{text}</p>
					</Card>

					<div className="flex flex-col gap-2 mt-0.5">
						<div className="flex items-center justify-between">
							<Label>Select Amount</Label>
							<span className="text-sm leading-none text-muted-foreground">
								Balance: {balance} USDC
							</span>
						</div>
						<Input
							type="number"
							value={stakeAmount}
							onChange={(e) => setStakeAmount(Number(e.target.value))}
							className="h-[40px]"
						/>
						<div className="grid grid-cols-5 gap-2">
							{[1, 5, 10, 25].map((amount) => (
								<Button
									className="w-full"
									key={amount}
									variant="outline"
									size="sm"
									onClick={() => increaseStake(amount)}
								>
									+{amount}
								</Button>
							))}
							<Button variant="outline" size="sm" onClick={setMaxStake}>
								MAX
							</Button>
						</div>
					</div>

					<div className="bg-muted/50 p-4 rounded-lg flex flex-col gap-1">
						<div className="flex justify-between">
							<span className="text-xs font-semibold">Potential Return:</span>
							<span className="text-xs font-semibold">?? USDC</span>
						</div>
						<p className="text-xs text-muted-foreground">
							Returns will vary based on the final market distribution and
							resolution with the official Community Note.
						</p>
					</div>

					<div className="flex justify-between gap-4">
						<DialogClose asChild>
							<Button variant="outline" className="flex-1">
								Cancel
							</Button>
						</DialogClose>
						<Button className="flex-1">Submit Prediction</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
