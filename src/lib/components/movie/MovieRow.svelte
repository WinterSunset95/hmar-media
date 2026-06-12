<script lang="ts">
	import type { Movie } from '$lib/types';
	import MovieCard from './MovieCard.svelte';
	import { ChevronRight } from '@lucide/svelte';
	import * as Carousel from '$lib/components/ui/carousel';

	let { title, movies, onMovieSelect } = $props<{
		title: string;
		movies: Movie[];
		onMovieSelect: (movie: Movie) => void;
	}>();
</script>

<!-- The group/row class lets us trigger the navigation arrows only when hovering over this specific rail -->
<div class="space-y-3 group/row relative">
	<div class="flex items-center justify-between">
		<h3 class="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-1 group cursor-pointer w-max">
			{title} 
			<ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
		</h3>
	</div>
	
	<!-- 
		dragFree: true gives it that native "flick and glide" feel instead of rigidly snapping to one item at a time.
		align: 'start' ensures the first item is flush with the left margin.
	-->
	<Carousel.Root
		opts={{
			align: 'start',
			dragFree: true
		}}
		class="w-full"
	>
		<!-- 
			Negative margin (-ml-4) on Content combined with padding (pl-4) on Items 
			creates the gap without breaking the carousel math 
		-->
		<Carousel.Content class="-ml-4 pb-4">
			{#each movies as movie (movie.$id)}
				<!-- 
					Responsive breakpoints: 
					Mobile: ~2.5 cards visible (basis-[40%]) 
					Tablet: ~3.3 cards visible (basis-[30%])
					Desktop: ~4.5 to ~5.5 cards visible 
				-->
				<Carousel.Item class="pl-4 basis-[40%] sm:basis-[30%] md:basis-[22%] lg:basis-[18%]">
					<MovieCard {movie} onclick={() => onMovieSelect(movie)} />
				</Carousel.Item>
			{/each}
		</Carousel.Content>

		<!-- 
			Desktop-only Navigation Arrows. 
			They sit outside the content flow and only appear when the user hovers the row. 
			Capacitor mobile users will just swipe.
		-->
		<div class="hidden sm:block opacity-0 transition-opacity duration-300 group-hover/row:opacity-100">
			<Carousel.Previous class="left-2 bg-background/80 backdrop-blur-sm border-0 shadow-lg hover:bg-background h-12 w-12" />
			<Carousel.Next class="right-2 bg-background/80 backdrop-blur-sm border-0 shadow-lg hover:bg-background h-12 w-12" />
		</div>
	</Carousel.Root>
</div>
