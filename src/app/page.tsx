import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "@/app/data.json";
import { MarketCard } from "@/components/product/market-card";

export default function Page() {
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
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
					<MarketCard {...tweetData} className="" />
					<MarketCard {...tweetData} className="" />
					<MarketCard {...tweetData} className="" />
				</div>
				<SectionCards />
				<div className="px-4 lg:px-6">
					<ChartAreaInteractive />
				</div>
				<DataTable data={data} />
			</div>
		</div>
	);
}
