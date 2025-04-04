import predictionData from "@/app/prediction-data.json";
import { MarketCard } from "@/components/product/market-card";
import { MarketPredictionsTable } from "@/components/product/market-predictions-table";

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
	};

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="flex flex-col gap-4 p-4 @5xl:flex-row">
				<MarketCard
					{...tweetData}
					className="@5xl:min-w-[320px] @5xl:max-w-[400px]"
				/>
				<MarketPredictionsTable data={predictionData} className="w-full" />
			</div>
		</div>
	);
}
