<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { MovieService } from '$lib/services/movies';
	import { InteractionService } from '$lib/services/interactions';
	import { RentalService } from '$lib/services/rentals';
	import type { Movie } from '$lib/types';
	import { toast } from 'svelte-sonner';

	// Component Imports
	import HomeSkeleton from '$lib/components/movie/HomeSkeleton.svelte';
	import HeroBanner from '$lib/components/movie/HeroBanner.svelte';
	import MovieRow from '$lib/components/movie/MovieRow.svelte';
	import MovieDetailModal from '$lib/components/movie/MovieDetailModal.svelte';

	// Svelte 5 Reactive States
	let featuredMovie = $state<Movie | null>(null);
	let trendingMovies = $state<Movie[]>([]);
	let localFavorites = $state<Movie[]>([]);
	let myWishlistIds = $state<Set<string>>(new Set());
	let myRentedIds = $state<Set<string>>(new Set());
	
	let isLoading = $state(true);
	let isInteractionLoading = $state(false);
	let selectedMovie = $state<Movie | null>(null);
	let showDetailsModal = $state(false);

	onMount(async () => {
		try {
			await fetchHomeData();
		} catch (error) {
			toast.error("Failed to load catalog. Please check your network connection.");
		} finally {
			isLoading = false;
		}
	});

	async function fetchHomeData() {
		const [allMovies, newAndHot] = await Promise.all([
			MovieService.getAll(30),
			MovieService.getNewAndHot(10)
		]);

		trendingMovies = newAndHot;
		localFavorites = allMovies.slice().reverse();

		// Dynamic Hero Assignment
		if (trendingMovies.length > 0) {
			featuredMovie = trendingMovies[0];
		}

		// Rehydrate user profiles and purchase matrices
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

	function openDetails(movie: Movie) {
		selectedMovie = movie;
		showDetailsModal = true;
	}

	function closeDetails() {
		showDetailsModal = false;
	}
</script>

<!-- Clean, highly maintainable landing orchestrator -->
<div class="w-full min-h-screen pb-24 text-foreground bg-background select-none">
	{#if isLoading}
		<HomeSkeleton />
	{:else}
		<!-- Main Spotlight Banner -->
		{#if featuredMovie}
			<HeroBanner 
				movie={featuredMovie}
				{myRentedIds}
				onRent={handleRentMovie}
				onMoreInfo={openDetails}
			/>
		{/if}

		<!-- Segmented Movie Rails -->
		<div class="px-4 mt-6 space-y-10 relative z-20">
			<MovieRow 
				title="New & Hot Releases" 
				movies={trendingMovies} 
				onMovieSelect={openDetails} 
			/>

			<MovieRow 
				title="Popular Favorites" 
				movies={localFavorites} 
				onMovieSelect={openDetails} 
			/>
		</div>
	{/if}
</div>

<!-- Bottom Paywall / Info Modal Drawer -->
<MovieDetailModal 
	movie={selectedMovie}
	show={showDetailsModal}
	{myRentedIds}
	{myWishlistIds}
	{isInteractionLoading}
	onClose={closeDetails}
	onRent={handleRentMovie}
	onToggleWishlist={toggleWishlist}
/>
