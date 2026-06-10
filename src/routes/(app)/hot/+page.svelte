<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { MovieService } from '$lib/services/movies';
	import { InteractionService } from '$lib/services/interactions';
	import { RentalService } from '$lib/services/rentals';
	import type { Movie } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import { Flame } from '@lucide/svelte';

	import HotSkeleton from '$lib/components/movie/HotSkeleton.svelte';
	import HotMovieCard from '$lib/components/movie/HotMovieCard.svelte';

	let trendingMovies = $state<Movie[]>([]);
	let myWishlistIds = $state<Set<string>>(new Set());
	let myRentedIds = $state<Set<string>>(new Set());
	
	let isLoading = $state(true);
	let isInteractionLoading = $state(false);

	onMount(async () => {
		try {
			await fetchHotData();
		} catch (error) {
			toast.error("Failed to load new releases.");
		} finally {
			isLoading = false;
		}
	});

	async function fetchHotData() {
		// Fetch up to 20 of the newest releases globally
		trendingMovies = await MovieService.getNewAndHot(20);

		if (auth.user) {
			const [wishlist, rentals] = await Promise.all([
				InteractionService.getUserInteractions(auth.user.$id, 'wishlist'),
				RentalService.getActiveUserRentals(auth.user.$id)
			]);
			
			myWishlistIds = new Set(wishlist.map(i => 
				typeof i.movie === 'string' ? i.movie : i.movie.$id
			));
			
			myRentedIds = new Set(rentals.map(r => 
				typeof r.movie === 'string' ? r.movie : r.movie.$id
			));
		}
	}

	async function toggleWishlist(movie: Movie) {
		if (!auth.user) {
			toast.error("You must be logged in to modify your wishlist");
			return;
		}

		isInteractionLoading = true;
		const mId = movie.$id;

		try {
			const added = await InteractionService.toggle(auth.user.$id, mId, 'wishlist');
			if (added) {
				myWishlistIds.add(mId);
				toast.success(`Added "${movie.title}" to My List`);
			} else {
				myWishlistIds.delete(mId);
				toast.success(`Removed "${movie.title}" from My List`);
			}
			myWishlistIds = new Set(myWishlistIds);
		} catch {
			toast.error("Wishlist sync failed");
		} finally {
			isInteractionLoading = false;
		}
	}

	async function handleRentMovie(movie: Movie) {
		if (!auth.user) {
			toast.error("Please login to rent movies");
			return;
		}

		try {
			await RentalService.mockPurchase(auth.user.$id, movie.$id);
			myRentedIds.add(movie.$id);
			myRentedIds = new Set(myRentedIds);
			toast.success(`Rent Successful! You have 48h to watch "${movie.title}"`);
		} catch {
			toast.error("Rental transaction failed");
		}
	}
</script>

<div class="w-full min-h-screen pb-24 text-foreground bg-background">
	
	<!-- Sticky Header for context -->
	<header class="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 mb-4 supports-[backdrop-filter]:bg-background/60">
		<h1 class="text-2xl font-extrabold tracking-tight flex items-center gap-2">
			<Flame class="w-6 h-6 text-primary fill-primary/20" />
			New & Hot
		</h1>
	</header>

	{#if isLoading}
		<HotSkeleton />
	{:else if trendingMovies.length === 0}
		<div class="flex flex-col items-center justify-center py-20 text-muted-foreground">
			<Flame class="w-12 h-12 mb-4 opacity-20" />
			<p>No new releases at the moment.</p>
		</div>
	{:else}
		<div class="max-w-xl mx-auto">
			{#each trendingMovies as movie (movie.$id)}
				<HotMovieCard 
					{movie}
					{myRentedIds}
					{myWishlistIds}
					{isInteractionLoading}
					onRent={handleRentMovie}
					onToggleWishlist={toggleWishlist}
				/>
			{/each}
		</div>
	{/if}
</div>
