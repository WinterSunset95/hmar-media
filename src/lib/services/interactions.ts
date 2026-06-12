import { databases, tablesdb } from '$lib/appwrite';
import { Query, ID } from 'appwrite';
import type { Interaction, InteractionType, Movie } from '$lib/types';
import { PUBLIC_DATABASE_ID } from '$env/static/public';

const TABLE_ID = 'interactions';

export const InteractionService = {
	/**
	 * Get all interactions of a specific type (e.g. 'wishlist') for a user
	 */
	async getUserInteractions(userId: string, type: InteractionType): Promise<Interaction[]> {
		try {
			const response = await tablesdb.listRows<Interaction>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [
					Query.equal('userId', userId),
					Query.equal('type', type),
					Query.orderDesc('timestamp'),
          Query.select(['*', 'movie.*'])
				]
      });
			return response.rows;
		} catch (error) {
			console.error(`[InteractionService.getUserInteractions] Failed for ${type}:`, error);
			throw error;
		}
	},

	/**
	 * Toggles a binary user action (Like / Wishlist)
	 * If the interaction exists, it deletes it. If not, it creates it.
	 */
	async toggle(userId: string, movie: Movie, type: 'like' | 'wishlist'): Promise<boolean> {
		try {
			// Check if interaction already exists using our optimized compound index search parameters
			const existing = await tablesdb.listRows<Interaction>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [
					Query.equal('userId', userId),
					Query.equal('type', type),
					Query.equal('movie', movie.$id),
					Query.limit(1)
				]
      });

			if (existing.total > 0) {
				// Record exists -> Delete it (Unlike / Remove from wishlist)
				const docId = existing.rows[0].$id;
				await tablesdb.deleteRow({ 
          databaseId: PUBLIC_DATABASE_ID,
          tableId: TABLE_ID,
          rowId: docId
        });
				return false; // Returns false indicating the state is now inactive
			} else {
				// Record does not exist -> Create it
				await tablesdb.createRow<Interaction>({
					databaseId: PUBLIC_DATABASE_ID,
					tableId: TABLE_ID,
					rowId: ID.unique(),
					data: {
						userId,
						movie: movie, // Appwrite automatically handles the relation key mapping
						type,
						timestamp: new Date().toISOString()
          }
        });
				return true; // Returns true indicating state is active
			}
		} catch (error) {
			console.error(`[InteractionService.toggle] Failed for ${type} on movie ${movie.$id}:`, error);
			throw error;
		}
	},

	/**
	 * Save/Update watch progress (upserts a progress document)
	 */
	async updateWatchProgress(userId: string, movieId: string, progressSeconds: number): Promise<void> {
		try {
			const existing = await databases.listDocuments<Interaction>(
				PUBLIC_DATABASE_ID,
				TABLE_ID,
				[
					Query.equal('userId', userId),
					Query.equal('type', 'watch_progress'),
					Query.equal('movie', movieId),
					Query.limit(1)
				]
			);

			const payload = {
				userId,
				movie: movieId,
				type: 'watch_progress',
				timestamp: new Date().toISOString(),
				progressSeconds
			};

			if (existing.total > 0) {
				const docId = existing.documents[0].$id;
				await databases.updateDocument(PUBLIC_DATABASE_ID, TABLE_ID, docId, payload);
			} else {
				await databases.createDocument(PUBLIC_DATABASE_ID, TABLE_ID, ID.unique(), payload);
			}
		} catch (error) {
			console.error(`[InteractionService.updateWatchProgress] Failed for movie ${movieId}:`, error);
		}
	}
};
