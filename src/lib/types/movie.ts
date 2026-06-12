import type { Models } from "appwrite";

export interface Movie extends Models.Row {
	title: string;
	description?: string;
	releaseDate: string; // ISO 8601 string from Appwrite Datetime column
	rentPrice: number;   // Stored in paisa/cents to prevent floating-point bugs
	posterId?: string;   // Appwrite Storage bucket file ID
	jellyfinStreamId?: string;
	searchKeywords?: string[];
}
