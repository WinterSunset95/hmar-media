<script lang="ts">
	import type { Movie } from '$lib/types';
	import { getPosterUrl } from '$lib/utils/movie';

	// Svelte 5 Runes Props
	let { movie, onclick } = $props<{
		movie: Movie;
		onclick: () => void;
	}>();
</script>

<button 
	{onclick}
	class="snap-start shrink-0 group focus:outline-none"
>
	<div class="relative w-32 h-48 sm:w-44 sm:h-64 rounded-md overflow-hidden bg-muted/35 shadow-md border border-border/10 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(225,29,72,0.2)]">
		<img 
			src={getPosterUrl(movie)} 
			alt={movie.title}
			class="w-full h-full object-cover"
			loading="lazy"
		/>
		<!-- Bottom Vignette overlay revealing price details on mouse enter -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
			<p class="text-xs font-bold text-white truncate text-left">{movie.title}</p>
			<p class="text-[10px] text-primary font-semibold text-left">₹{movie.rentPrice / 100}</p>
		</div>
	</div>
</button>
