<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import { RentalService } from '$lib/services/rentals';
	import { InteractionService } from '$lib/services/interactions';
	import type { Rental, Interaction, Movie } from '$lib/types';
	import { toast } from 'svelte-sonner';

	// Dumb View Components
	import ProfileSkeleton from '$lib/components/profile/ProfileSkeleton.svelte';
	import ProfileHeader from '$lib/components/profile/ProfileHeader.svelte';
	import ProfileTabs from '$lib/components/profile/ProfileTabs.svelte';

	let isLoading = $state(true);
	let userRentals = $state<Rental[]>([]);
	let userWishlists = $state<Interaction[]>([]);
	let userLikes = $state<Interaction[]>([]);

	onMount(async () => {
		// Route Guard: Eject to login if unauthenticated
		if (!auth.user) {
			goto('/login');
			return;
		}

		try {
			// Fetch all user relational data concurrently
			const [rentals, wishlists, likes] = await Promise.all([
				RentalService.getActiveUserRentals(auth.user.$id),
				InteractionService.getUserInteractions(auth.user.$id, 'wishlist'),
				InteractionService.getUserInteractions(auth.user.$id, 'like')
			]);

			userRentals = rentals;
			userWishlists = wishlists;
			userLikes = likes;
		} catch (error) {
			toast.error("Failed to load profile data.");
			console.error(error);
		} finally {
			isLoading = false;
		}
	});

	async function handleLogout() {
		try {
			await auth.logout();
			toast.success("Successfully logged out");
			goto('/login');
		} catch (error) {
			toast.error("Failed to logout securely.");
		}
	}

	function handleMovieAction(movie: Movie) {
		// Depending on your routing structure, this either opens the modal
		// or routes them to a dedicated /movie/[id] page.
		toast.info(`Triggered action for: ${movie.title}`);
	}
</script>

<div class="w-full min-h-screen pb-24 px-4 pt-6 bg-background text-foreground">
	<div class="max-w-3xl mx-auto space-y-8">
		
		{#if isLoading}
			<ProfileSkeleton />
		{:else if auth.user}
			<ProfileHeader 
				name={auth.user.name} 
				email={auth.user.email} 
				onLogout={handleLogout} 
			/>

			<div class="pt-2">
				<ProfileTabs 
					rentals={userRentals}
					wishlists={userWishlists}
					likes={userLikes}
					onMovieSelect={handleMovieAction}
				/>
			</div>
		{/if}

	</div>
</div>
