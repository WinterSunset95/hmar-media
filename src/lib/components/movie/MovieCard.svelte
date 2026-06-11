<script lang="ts">
	import type { Movie } from '$lib/types';
	import { getPosterUrl } from '$lib/utils/movie';
	import * as Card from '$lib/components/ui/card';

	// Svelte 5 Runes Props
	let { movie, onclick } = $props<{
		movie: Movie;
		onclick: () => void;
	}>();
</script>

<button 
	{onclick}
	class="snap-start shrink-0 group rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
	aria-label={`View details for ${movie.title}`}
>
	<Card.Root class="relative w-32 h-48 sm:w-44 sm:h-64 rounded-xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(225,29,72,0.3)] border-border/40 bg-muted/35">
		<img 
			src={getPosterUrl(movie)} 
			alt={movie.title}
			class="w-full h-full object-cover"
			loading="lazy"
		/>
		
		<!-- Bottom Vignette overlay revealing price details on mouse enter or focus -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex flex-col justify-end p-3">
			<p class="text-xs sm:text-sm font-bold text-white truncate text-left drop-shadow-md">{movie.title}</p>
			<p class="text-[10px] sm:text-xs text-primary font-bold text-left">₹{movie.rentPrice / 100}</p>
		</div>
	</Card.Root>
</button>
