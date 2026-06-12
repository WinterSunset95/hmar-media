import { databases, tablesdb } from '$lib/appwrite';
import { Query, ID } from 'appwrite';
import type { Movie, Rental } from '$lib/types';
import { PUBLIC_DATABASE_ID } from '$env/static/public';

const TABLE_ID = 'rentals';

export const RentalService = {
	/**
	 * Get all active (unexpired) rentals for a specific user
	 */
	async getActiveUserRentals(userId: string): Promise<Rental[]> {
		try {
			const now = new Date().toISOString();
      const response = await tablesdb.listRows<Rental>({
        databaseId: PUBLIC_DATABASE_ID,
        tableId: TABLE_ID,
        queries: [
          Query.equal('userId', userId),
          Query.greaterThan('expiresAt', now),
          Query.orderDesc('expiresAt'),
          Query.select(["*", 'movie.*'])
        ],
      })
			return response.rows;
		} catch (error) {
			console.error('[RentalService.getActiveUserRentals] Failed:', error);
			throw error;
		}
	},

	/**
	 * Checks if a user has active viewing rights for a specific movie
	 */
	async verifyAccess(userId: string, movieId: string): Promise<boolean> {
		try {
			const now = new Date().toISOString();
			const response = await tablesdb.listRows<Rental>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [
					Query.equal('userId', userId),
					Query.equal('movie', movieId),
					Query.greaterThan('expiresAt', now),
					Query.limit(1)
				]
      });
			return response.total > 0;
		} catch (error) {
			console.error(`[RentalService.verifyAccess] Failed for movie ${movieId}:`, error);
			return false;
		}
	},

	/**
	 * DANGER/TESTING ONLY: Creates an active lease document.
	 * * PRODUCTION WARNING: In a real environment, this method should NEVER be called 
	 * directly from the frontend Svelte code. If you do, a user can modify the JS context 
	 * in their webview to bypass payment constraints. 
	 * * Real checkouts should fire a webhook from Razorpay/Stripe to a secure Appwrite Serverless 
	 * Function, which uses a system API key to write this document.
	 */
	async mockPurchase(userId: string, movie: Movie, durationDays = 2): Promise<Rental> {
		try {
			const rentedAt = new Date();
			const expiresAt = new Date();
			expiresAt.setDate(rentedAt.getDate() + durationDays);

			return await tablesdb.createRow<Rental>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				rowId: ID.unique(),
				data: {
					userId,
					movie: movie,
					rentedAt: rentedAt.toISOString(),
					expiresAt: expiresAt.toISOString(),
					paymentReference: 'MOCK_UPI_TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase()
				}
      });
		} catch (error) {
			console.error(`[RentalService.mockPurchase] Failed for movie ${movie.$id}:`, error);
			throw error;
		}
	}
};
