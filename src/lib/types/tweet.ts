import { Market } from "./market";

export interface Tweet {
	__typename: string;
	lang: string;
	favorite_count: number;
	possibly_sensitive?: boolean;
	created_at: string;
	display_text_range: [number, number];
	entities: TweetEntities;
	id_str: string;
	text: string;
	user: TweetUser;
	edit_control: EditControl;
	mediaDetails?: MediaDetail[];
	photos?: Photo[];
	conversation_count: number;
	news_action_type: string;
	birdwatch_pivot?: BirdwatchPivot;
	isEdited: boolean;
	isStaleEdit: boolean;
	quoted_tweet?: Tweet;
}

export interface TweetEntities {
	hashtags: any[];
	urls: any[];
	user_mentions: UserMention[];
	symbols: any[];
	media?: Media[];
}

export interface UserMention {
	id_str: string;
	indices: [number, number];
	name: string;
	screen_name: string;
}

export interface Media {
	display_url: string;
	expanded_url: string;
	indices: [number, number];
	url: string;
}

export interface TweetUser {
	id_str?: string;
	name: string;
	profile_image_url_https: string;
	screen_name: string;
	verified?: boolean;
	is_blue_verified?: boolean;
	profile_image_shape?: string;
}

export interface EditControl {
	edit_tweet_ids: string[];
	editable_until_msecs: string;
	is_edit_eligible: boolean;
	edits_remaining: string;
}

export interface MediaDetail {
	display_url: string;
	expanded_url: string;
	ext_media_availability: {
		status: string;
	};
	indices: [number, number];
	media_url_https: string;
	original_info: {
		height: number;
		width: number;
		focus_rects: FocusRect[];
	};
	sizes: {
		large: Size;
		medium: Size;
		small: Size;
		thumb: Size;
	};
	type: string;
	url: string;
}

export interface FocusRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface Size {
	h: number;
	resize: string;
	w: number;
}

export interface Photo {
	backgroundColor: {
		red: number;
		green: number;
		blue: number;
	};
	cropCandidates: FocusRect[];
	expandedUrl: string;
	url: string;
	width: number;
	height: number;
}

export interface BirdwatchPivot {
	destinationUrl: string;
	title: string;
	shorttitle: string;
	visualStyle: string;
	subtitle: {
		text: string;
		entities: Entity[];
	};
	iconType: string;
	footer: {
		text: string;
		entities: Entity[];
	};
	noteId: string;
}

export interface Entity {
	fromIndex: number;
	toIndex: number;
	ref: {
		url: {
			url: string;
			urlType: string;
		};
	};
}

export interface TweetProps {
	market?: Market;
	text: string;
	user: TweetUser;
	created_at: string;
	id_str?: string;
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
	status: string;
	volume: number;
	participants: number;
	endTime: string;
	variant?: "default" | "compact";
}
