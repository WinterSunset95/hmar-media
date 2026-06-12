<script lang="ts">
	import type { Movie } from '$lib/types';
	import { getPosterUrl } from '$lib/utils/movie';
	import { Play, Tv, Plus, Check, CalendarDays } from '@lucide/svelte';
	
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	let { 
		movie, 
		myRentedIds, 
		myWishlistIds, 
		isInteractionLoading,
		onRent, 
		onToggleWishlist,
    handleclick
	} = $props<{
		movie: Movie;
		myRentedIds: Set<string>;
		myWishlistIds: Set<string>;
		isInteractionLoading: boolean;
		onRent: (movie: Movie) => void;
		onToggleWishlist: (movie: Movie) => void;
    handleclick: (movie: Movie) => void
	}>();

	let isRented = $derived(myRentedIds.has(movie.$id));
	let isWishlisted = $derived(myWishlistIds.has(movie.$id));
	
	// Format the date to look cinematic (e.g., "Coming November 24")
	let releaseDate = $derived(new Date(movie.releaseDate));
	let isReleased = $derived(releaseDate <= new Date());
	let dateString = $derived(releaseDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' }));
</script>

<Card.Root class="overflow-hidden border-border bg-card shadow-lg mb-8 mx-4" onclick={() => handleclick(movie)}>
	<!-- Hero Poster Area -->
	<div class="relative w-full h-64 sm:h-96 bg-muted">
		<img 
			src={getPosterUrl(movie)} 
			alt={movie.title}
			class="w-full h-full object-cover"
			loading="lazy"
		/>
		{#if !isReleased}
			<div class="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
				<Badge variant="secondary" class="text-sm px-4 py-1.5 opacity-90 shadow-xl">
					<CalendarDays class="w-4 h-4 mr-2" />
					Coming {dateString}
				</Badge>
			</div>
		{/if}
	</div>

	<Card.Content class="p-5">
		<!-- Header / Title -->
		<div class="space-y-1.5 mb-4">
			<div class="flex items-center gap-2">
				<h2 class="text-2xl font-bold tracking-tight text-card-foreground">
					{movie.title}
				</h2>
				{#if isReleased}
					<Badge variant="default" class="bg-primary text-primary-foreground">NEW</Badge>
				{/if}
			</div>
			
			<p class="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
				<CalendarDays class="w-3.5 h-3.5" />
				{isReleased ? `Released ${dateString}` : `Premieres ${dateString}`}
				<span class="mx-1">•</span>
				<span class="text-primary font-bold">₹{movie.rentPrice / 100}</span>
			</p>
		</div>

		<!-- Synopsis -->
		<p class="text-sm text-muted-foreground leading-relaxed line-clamp-3">
			{movie.description}
		</p>
		
		<!-- Tags -->
		{#if movie.searchKeywords && movie.searchKeywords.length > 0}
			<div class="flex flex-wrap gap-2 mt-4">
				{#each movie.searchKeywords.slice(0, 3) as tag}
					<Badge variant="outline" class="text-[10px] uppercase tracking-wider text-muted-foreground">{tag}</Badge>
				{/each}
			</div>
		{/if}
	</Card.Content>

	<!-- Actions -->
	<!-- <Card.Footer class="p-5 pt-0 flex gap-3"> -->
	<!-- 	{#if isRented} -->
	<!-- 		<Button variant="secondary" class="flex-1 font-bold shadow-sm"> -->
	<!-- 			<Play class="w-4 h-4 mr-2 fill-current" /> -->
	<!-- 			Watch Now -->
	<!-- 		</Button> -->
	<!-- 	{:else} -->
	<!-- 		<Button  -->
	<!-- 			variant="default"  -->
	<!-- 			class="flex-1 font-bold shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all" -->
	<!-- 			onclick={() => onRent(movie)} -->
	<!-- 			disabled={!isReleased} -->
	<!-- 		> -->
	<!-- 			<Tv class="w-4 h-4 mr-2" /> -->
	<!-- 			{isReleased ? `Rent ₹${movie.rentPrice / 100}` : 'Coming Soon'} -->
	<!-- 		</Button> -->
	<!-- 	{/if} -->
	<!---->
	<!-- 	<Button  -->
	<!-- 		variant="outline"  -->
	<!-- 		size="icon"  -->
	<!-- 		class="shrink-0 border-border" -->
	<!-- 		onclick={() => onToggleWishlist(movie)} -->
	<!-- 		disabled={isInteractionLoading} -->
	<!-- 	> -->
	<!-- 		{#if isWishlisted} -->
	<!-- 			<Check class="w-5 h-5 text-primary" /> -->
	<!-- 		{:else} -->
	<!-- 			<Plus class="w-5 h-5" /> -->
	<!-- 		{/if} -->
	<!-- 	</Button> -->
	<!-- </Card.Footer> -->
</Card.Root>
