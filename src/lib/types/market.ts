import { Tweet } from "./tweet";

export interface Market {
	creationtime: string;
	creator: string;
	deadline: string;
	marketid: string;
	tweetid: string;
	tweet: Tweet;
	volume: string;
	participants: number;
}
