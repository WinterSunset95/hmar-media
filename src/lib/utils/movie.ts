import type { Movie } from '$lib/types';

/**
 * Resolves poster image sources, gracefully falling back to dark cinematic presets
 * if raw storage IDs or invalid URLs are provided.
 */
export function getPosterUrl(movie: Movie): string {
	if (movie.posterId && (movie.posterId.startsWith('http') || movie.posterId.startsWith('/'))) {
		return movie.posterId;
	}
	return `https://picsum.photos/seed/${movie.posterId ?? 'random'}/200/500`;
}
