import { databases } from '$lib/appwrite';
import { Query, ID } from 'appwrite';
import type { Interaction, InteractionType } from '$lib/types';
import { DATABASE_ID } from '$env/static/private';

const TABLE_ID = 'interactions';

export const InteractionService = {
	/**
	 * Get all interactions of a specific type (e.g. 'wishlist') for a user
	 */
	async getUserInteractions(userId: string, type: InteractionType): Promise<Interaction[]> {
		try {
			const response = await databases.listDocuments<Interaction>(
				DATABASE_ID,
				TABLE_ID,
				[
					Query.equal('userId', userId),
					Query.equal('type', type),
					Query.orderDesc('timestamp')
				]
			);
			return response.documents;
		} catch (error) {
			console.error(`[InteractionService.getUserInteractions] Failed for ${type}:`, error);
			throw error;
		}
	},

	/**
	 * Toggles a binary user action (Like / Wishlist)
	 * If the interaction exists, it deletes it. If not, it creates it.
	 */
	async toggle(userId: string, movieId: string, type: 'like' | 'wishlist'): Promise<boolean> {
		try {
			// Check if interaction already exists using our optimized compound index search parameters
			const existing = await databases.listDocuments<Interaction>(
				DATABASE_ID,
				TABLE_ID,
				[
					Query.equal('userId', userId),
					Query.equal('type', type),
					Query.equal('movie', movieId),
					Query.limit(1)
				]
			);

			if (existing.total > 0) {
				// Record exists -> Delete it (Unlike / Remove from wishlist)
				const docId = existing.documents[0].$id;
				await databases.deleteDocument(DATABASE_ID, TABLE_ID, docId);
				return false; // Returns false indicating the state is now inactive
			} else {
				// Record does not exist -> Create it
				await databases.createDocument(
					DATABASE_ID,
					TABLE_ID,
					ID.unique(),
					{
						userId,
						movie: movieId, // Appwrite automatically handles the relation key mapping
						type,
						timestamp: new Date().toISOString()
					}
				);
				return true; // Returns true indicating state is active
			}
		} catch (error) {
			console.error(`[InteractionService.toggle] Failed for ${type} on movie ${movieId}:`, error);
			throw error;
		}
	},

	/**
	 * Save/Update watch progress (upserts a progress document)
	 */
	async updateWatchProgress(userId: string, movieId: string, progressSeconds: number): Promise<void> {
		try {
			const existing = await databases.listDocuments<Interaction>(
				DATABASE_ID,
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
				await databases.updateDocument(DATABASE_ID, TABLE_ID, docId, payload);
			} else {
				await databases.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), payload);
			}
		} catch (error) {
			console.error(`[InteractionService.updateWatchProgress] Failed for movie ${movieId}:`, error);
		}
	}
};
