<script lang="ts">
	import type { Movie } from '$lib/types';
	import MovieCard from './MovieCard.svelte';
	import { ChevronRight } from '@lucide/svelte';

	let { title, movies, onMovieSelect } = $props<{
		title: string;
		movies: Movie[];
		onMovieSelect: (movie: Movie) => void;
	}>();
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<h3 class="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-1 group">
			{title} 
			<ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer" />
		</h3>
	</div>
	
	<!-- Smooth horizontal slider layout -->
	<div class="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth touch-pan-x">
		{#each movies as movie (movie.$id)}
			<MovieCard {movie} onclick={() => onMovieSelect(movie)} />
		{/each}
	</div>
</div>

<style>
	/* Explicit webkit overrides to ensure scroll rails are scrollable but visually clean */
	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-none {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
