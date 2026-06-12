import type { Models } from 'appwrite';
import type { Movie } from './movie';

export type InteractionType = 'like' | 'wishlist' | 'watch_progress';

export interface Interaction extends Models.Row {
	userId: string;
	movie: Movie;
	type: InteractionType;
	timestamp: string;
	progressSeconds?: number; // Only present if type === 'watch_progress'
}
