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
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { TweetProps } from "@/lib/types/tweet";
import { IconRosetteDiscountCheckFilled as IconVerified } from "@tabler/icons-react";
import { parseEther } from "viem";
import { Market } from "@/lib/types/market";
import { useAccount, useBalance } from "wagmi";
// Define specific props for the modal, including onSubmit
interface SubmitPredictionModalProps extends TweetProps {
	onSubmit: (
		marketId: string,
		reasonText: string,
		reasonEmbedding: Uint8Array,
		stakeAmount: bigint
	) => void;
	market: Market;
}

export function SubmitPredictionModal({
	market,
	onSubmit,
	...props
}: SubmitPredictionModalProps) {
	const [stakeAmount, setStakeAmount] = useState(0);
	const [prediction, setPrediction] = useState("");

	const { address } = useAccount();
	const { data: balance } = useBalance({
		address,
	});

	const handleSubmit = async () => {
		const response = await fetch("/api/embedding", {
			method: "POST",
			body: JSON.stringify({ text: prediction }),
		});
		const { encoded } = await response.json();
		console.log("encoded", encoded);
		onSubmit(
			market.marketid,
			prediction,
			encoded,
			parseEther(stakeAmount.toString())
		);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="lg" className="w-full h-[35px]">
					Submit New Prediction
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Submit New Prediction</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Card className="p-4 bg-muted/50 flex flex-col gap-2">
						<div className="flex items-center gap-2 flex-wrap">
							<Avatar className="size-[20px] rounded-full overflow-hidden">
								<AvatarImage
									src={market.tweet.user.profile_image_url_https}
									alt={market.tweet.user.name}
								/>
								<AvatarFallback>{market.tweet.user.name[0]}</AvatarFallback>
							</Avatar>
							<span className="text-sm font-semibold">
								{market.tweet.user.name}
							</span>
							{market.tweet.user.is_blue_verified && (
								<IconVerified className="!size-[16px] text-blue-500" />
							)}
							<span className="text-sm text-muted-foreground">
								@{market.tweet.user.screen_name}
							</span>
						</div>
						<p className="text-sm line-clamp-2">{market.tweet.text}</p>
					</Card>

					<div className="flex flex-col gap-2 mt-0.5">
						<Label>Your Community Note Prediction:</Label>
						<Textarea
							placeholder="Write what you think the Community Note will say..."
							className="min-h-[100px]"
							value={prediction}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								setPrediction(e.target.value)
							}
						/>
					</div>

					<div className="flex flex-col gap-2 mt-0.5">
						<div className="flex items-center justify-between">
							<Label>Select Amount</Label>
							<span className="text-sm leading-none text-muted-foreground">
								Balance: {balance?.formatted} POL
							</span>
						</div>
						<Input
							type="number"
							value={stakeAmount}
							onChange={(e) => setStakeAmount(Number(e.target.value))}
							className="h-[40px]"
						/>
					</div>

					<div className="flex justify-between gap-4">
						<DialogClose asChild>
							<Button variant="outline" className="flex-1">
								Cancel
							</Button>
						</DialogClose>
						<Button className="flex-1" onClick={handleSubmit}>
							Submit Prediction
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
