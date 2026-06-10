import { databases } from '$lib/appwrite';
import { Query } from 'appwrite';
import type { Movie } from '$lib/types';
import { DATABASE_ID } from '$env/static/private';

const TABLE_ID = 'movies';

export const MovieService = {
	/**
	 * Fetch the entire active movie catalog
	 */
	async getAll(limit = 25): Promise<Movie[]> {
		try {
			const response = await databases.listDocuments<Movie>(
				DATABASE_ID,
				TABLE_ID,
				[Query.limit(limit)]
			);
			return response.documents;
		} catch (error) {
			console.error('[MovieService.getAll] Failed to fetch movies:', error);
			throw error;
		}
	},

	/**
	 * Fetch a single movie by its ID
	 */
	async getById(movieId: string): Promise<Movie> {
		try {
			return await databases.getDocument<Movie>(
				DATABASE_ID,
				TABLE_ID,
				movieId
			);
		} catch (error) {
			console.error(`[MovieService.getById] Failed to fetch movie ${movieId}:`, error);
			throw error;
		}
	},

	/**
	 * New & Hot: Fetch movies sorted by release date descending
	 */
	async getNewAndHot(limit = 10): Promise<Movie[]> {
		try {
			const response = await databases.listDocuments<Movie>(
				DATABASE_ID,
				TABLE_ID,
				[
					Query.orderDesc('releaseDate'),
					Query.limit(limit)
				]
			);
			return response.documents;
		} catch (error) {
			console.error('[MovieService.getNewAndHot] Failed:', error);
			throw error;
		}
	},

	/**
	 * Search movies by titles or custom keywords
	 */
	async search(searchTerm: string, limit = 15): Promise<Movie[]> {
		if (!searchTerm.trim()) return [];
		
		try {
			const response = await databases.listDocuments<Movie>(
				DATABASE_ID,
				TABLE_ID,
				[
					// Appwrite searches on full-text indexed columns (searchKeywords)
					Query.or([
						Query.contains('title', searchTerm),
						Query.contains('searchKeywords', searchTerm)
					]),
					Query.limit(limit)
				]
			);
			return response.documents;
		} catch (error) {
			console.error(`[MovieService.search] Failed for term "${searchTerm}":`, error);
			throw error;
		}
	}
};
