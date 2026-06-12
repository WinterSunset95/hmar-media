<script lang="ts">
	import type { Movie } from '$lib/types';
	import { getPosterUrl } from '$lib/utils/movie';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Play, Clock } from '@lucide/svelte';

	let { movie, subtext, isRental, onAction } = $props<{
		movie: Movie;
		subtext?: string;
		isRental?: boolean;
		onAction: (movie: Movie) => void;
	}>();

</script>

<!-- 
	Made the entire card an interactive target.
	flex-row ensures strict horizontal orientation across all viewports.
-->
<Card.Root 
	class="flex flex-row overflow-hidden h-32 w-full hover:bg-muted/30 transition-colors border-border group cursor-pointer shadow-sm" 
	onclick={() => onAction(movie)}
>
	<!-- 
		Image Wrapper: Fixed width, absolute image to prevent flex stretching weirdness.
		Added a subtle right border to define the edge against the dark background.
	-->
	<div class="w-24 sm:w-28 shrink-0 relative bg-muted border-r border-border/50">
		<img 
			src={getPosterUrl(movie)} 
			alt={movie.title}
			class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
			loading="lazy"
		/>
	</div>

	<!-- 
		Content Wrapper: min-w-0 is the magic flexbox property that stops 
		the title text from blowing out the card's width boundaries. 
		We bypass Card.Content here to avoid Shadcn's aggressive default padding.
	-->
	<div class="p-3 sm:p-4 flex flex-1 flex-col justify-between min-w-0">
		<div class="space-y-1">
			<!-- Changed line-clamp-1 to truncate for cleaner single-line overflow handling -->
			<h4 class="font-bold text-card-foreground text-sm sm:text-base leading-tight truncate">
				{movie.title}
			</h4>
			{#if subtext}
				<p class="text-xs text-muted-foreground flex items-center gap-1.5">
					<Clock class="w-3.5 h-3.5 shrink-0" /> 
					<span class="truncate">{subtext}</span>
				</p>
			{/if}
		</div>

		<div class="flex items-center justify-between mt-auto pt-2">
			{#if isRental}
				<!-- pointer-events-none stops the badge from hijacking clicks -->
				<Badge variant="secondary" class="bg-primary/10 text-primary hover:bg-primary/20 border-0 pointer-events-none">
					Active
				</Badge>
				
				<!-- e.stopPropagation() prevents triggering the card's parent onclick -->
				<Button 
					size="sm" 
					class="h-8 shadow-[0_0_10px_rgba(225,29,72,0.3)] shrink-0" 
					onclick={(e) => { e.stopPropagation(); onAction(movie); }}
				>
					<Play class="w-3.5 h-3.5 mr-1.5 fill-current" /> Watch
				</Button>
			{:else}
				<Badge variant="outline" class="text-[10px] text-muted-foreground pointer-events-none">
					₹{movie.rentPrice / 100}
				</Badge>
				
				<Button 
					size="sm" 
					variant="secondary" 
					class="h-8 shrink-0" 
					onclick={(e) => { e.stopPropagation(); onAction(movie); }}
				>
					Details
				</Button>
			{/if}
		</div>
	</div>
</Card.Root>
