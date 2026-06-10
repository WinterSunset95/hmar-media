import type { Models } from 'appwrite';

export interface UserProfile extends Models.Document {
	userId: string;
	avatarId?: string;
	preferences?: string; // Stringified JSON configuration object
}
