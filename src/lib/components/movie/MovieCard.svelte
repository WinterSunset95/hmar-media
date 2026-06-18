<script lang="ts">
	import type { Movie } from '$lib/types';
  import { MovieService } from '$lib/services/movies';
	import * as Card from '$lib/components/ui/card';

	let { movie, onclick } = $props<{
		movie: Movie;
		onclick: () => void;
	}>();
</script>

<!-- 
	Removed: snap-start, shrink-0 
	Added: w-full 
	The Carousel item now dictates the physical width, we just fill it.
-->
<button 
	{onclick}
	class="w-full group rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
	aria-label={`View details for ${movie.title}`}
>
	<!-- 
		Removed: w-32 h-48 sm:w-44 sm:h-64
		Added: w-full aspect-[2/3]
		This mathematically guarantees a perfect poster ratio regardless of viewport width.
	-->
	<Card.Root class="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_15px_rgba(225,29,72,0.3)] border-border/40 bg-muted/35">
		<img 
			src={MovieService.getPosterUrl(movie)} 
			alt={movie.title}
			class="w-full h-full object-cover"
			loading="lazy"
		/>
		
		<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex flex-col justify-end p-3">
			<p class="text-xs sm:text-sm font-bold text-white truncate text-left drop-shadow-md">{movie.title}</p>
			<p class="text-[10px] sm:text-xs text-primary font-bold text-left">₹{movie.rentPrice / 100}</p>
		</div>
	</Card.Root>
</button>
