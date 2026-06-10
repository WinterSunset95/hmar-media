import type { Movie } from '$lib/types';

/**
 * Resolves poster image sources, gracefully falling back to dark cinematic presets
 * if raw storage IDs or invalid URLs are provided.
 */
export function getPosterUrl(movie: Movie): string {
	if (movie.posterId && (movie.posterId.startsWith('http') || movie.posterId.startsWith('/'))) {
		return movie.posterId;
	}
	return `https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop`;
}
