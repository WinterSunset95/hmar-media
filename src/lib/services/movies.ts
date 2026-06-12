import { tablesdb } from '$lib/appwrite';
import { Query } from 'appwrite';
import type { Movie } from '$lib/types';
import { PUBLIC_DATABASE_ID } from '$env/static/public';

const TABLE_ID = 'movies';

export const MovieService = {
	/**
	 * Fetch the entire active movie catalog
	 */
	async getAll(limit = 25): Promise<Movie[]> {
		try {
			const response = await tablesdb.listRows<Movie>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [Query.limit(limit)]
      });
			return response.rows;
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
			return await tablesdb.getRow<Movie>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				rowId: movieId
      });
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
			const response = await tablesdb.listRows<Movie>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [
					Query.orderDesc('releaseDate'),
					Query.limit(limit)
				]
      });
			return response.rows;
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
			const response = await tablesdb.listRows<Movie>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [
					// Appwrite searches on full-text indexed columns (searchKeywords)
					Query.or([
						Query.contains('title', searchTerm),
						Query.contains('searchKeywords', searchTerm)
					]),
					Query.limit(limit)
				]
      });
			return response.rows;
		} catch (error) {
			console.error(`[MovieService.search] Failed for term "${searchTerm}":`, error);
			throw error;
		}
	}
};
