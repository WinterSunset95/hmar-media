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

<Card.Root class="flex overflow-hidden h-32 hover:bg-muted/30 transition-colors border-border group">
	<div class="w-24 shrink-0 relative bg-muted">
		<img 
			src={getPosterUrl(movie)} 
			alt={movie.title}
			class="w-full h-full object-cover transition-transform group-hover:scale-105"
			loading="lazy"
		/>
	</div>

	<Card.Content class="p-4 py-3 flex flex-col justify-between w-full h-full">
		<div>
			<h4 class="font-bold text-card-foreground leading-tight line-clamp-1">{movie.title}</h4>
			{#if subtext}
				<p class="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
					<Clock class="w-3 h-3" /> {subtext}
				</p>
			{/if}
		</div>

		<div class="flex items-center justify-between mt-auto">
			{#if isRental}
				<Badge variant="default" class="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Active Rental</Badge>
				<Button size="sm" variant="default" class="h-8 shadow-[0_0_10px_rgba(225,29,72,0.3)]" onclick={() => onAction(movie)} disabled={false}>
					<Play class="w-3.5 h-3.5 mr-1.5 fill-current" /> Watch
				</Button>
			{:else}
				<Badge variant="outline" class="text-[10px] text-muted-foreground">₹{movie.rentPrice / 100}</Badge>
				<Button size="sm" variant="secondary" class="h-8" onclick={() => onAction(movie)} disabled={false}>
					Details
				</Button>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
