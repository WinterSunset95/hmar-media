<script lang="ts">
	import type { Movie } from '$lib/types';
  import { MovieService } from '$lib/services/movies';
	import { Play, Tv, Info } from '@lucide/svelte';

	let { movie, myRentedIds, onRent, onMoreInfo } = $props<{
		movie: Movie;
		myRentedIds: Set<string>;
		onRent: (movie: Movie) => void;
		onMoreInfo: (movie: Movie) => void;
	}>();

	// Highly optimized Svelte 5 derived state
	let isRented = $derived(myRentedIds.has(movie.$id));
</script>

<div 
	class="relative w-full h-[60vh] sm:h-[75vh] flex flex-col justify-end p-6 bg-cover bg-center transition-all duration-700"
	style="background-image: linear-gradient(to top, var(--background) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.7) 100%), url({MovieService.getPosterUrl(movie)});"
>
	<!-- Ambient light diffusion layer -->
	<div class="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"></div>

	<div class="relative z-10 max-w-xl space-y-3">
		<h2 class="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg text-white">
			{movie.title}
		</h2>
		
		<p class="text-sm sm:text-base text-muted-foreground line-clamp-3 drop-shadow">
			{movie.description}
		</p>

		<!-- Meta Tags Row -->
		<div class="flex items-center gap-2 text-xs font-semibold text-white/90">
			<span class="px-2 py-0.5 rounded bg-primary text-primary-foreground font-bold">NEW</span>
			<span class="text-primary font-bold">₹{movie.rentPrice / 100} Rent</span>
			<span>•</span>
			<span>Hmar Cinema</span>
		</div>

		<!-- Action triggers -->
		<div class="flex flex-wrap items-center gap-3 pt-3">
			{#if isRented}
				<button class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-bold text-black bg-white hover:bg-white/90 transition-all text-sm shadow">
					<Play class="w-4 h-4 fill-black" />
					Watch Now
				</button>
			{:else}
				<button 
					onclick={() => onRent(movie)}
					class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-bold text-white bg-primary hover:bg-primary/90 transition-all text-sm shadow-[0_0_15px_rgba(225,29,72,0.4)]"
				>
					<Tv class="w-4 h-4" />
					Rent for ₹{movie.rentPrice / 100}
				</button>
			{/if}

			<button 
				onclick={() => onMoreInfo(movie)}
				class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all text-sm"
			>
				<Info class="w-4 h-4" />
				More Info
			</button>
		</div>
	</div>
</div>
