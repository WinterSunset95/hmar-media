import type { Models } from 'appwrite';
import type { Movie } from './movie';

export interface Rental extends Models.Document {
	userId: string;
	/**
	 * Because we configured a Many-to-One relationship column, Appwrite 
	 * automatically nests the full Movie document when fetched.
	 */
	movie: Movie; 
	rentedAt: string;
	expiresAt: string;
	paymentReference?: string;
}
