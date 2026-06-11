<script lang="ts">
	import type { Rental, Interaction } from '$lib/types';
	import * as Tabs from '$lib/components/ui/tabs';
	import ProfileMovieCard from './ProfileMovieCard.svelte';
	import { Film, Heart, Bookmark } from '@lucide/svelte';

	let { rentals, likes, wishlists, onMovieSelect } = $props<{
		rentals: Rental[];
		likes: Interaction[];
		wishlists: Interaction[];
		onMovieSelect: (movie: any) => void;
	}>();

	// Helper to calculate time remaining for rentals
	const getExpiryText = (expiresAt: string) => {
		const hoursLeft = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)));
		return hoursLeft > 24 ? `${Math.floor(hoursLeft/24)} days left` : `${hoursLeft} hours left`;
	};
</script>

<Tabs.Root value="rentals" class="w-full">
	<Tabs.List class="grid w-full grid-cols-3 max-w-md mb-6 bg-muted/50 p-1">
		<Tabs.Trigger value="rentals" class="data-[state=active]:bg-background data-[state=active]:shadow-sm">
			<Film class="w-4 h-4 mr-2" /> Rentals
		</Tabs.Trigger>
		<Tabs.Trigger value="wishlist" class="data-[state=active]:bg-background data-[state=active]:shadow-sm">
			<Bookmark class="w-4 h-4 mr-2" /> Wishlist
		</Tabs.Trigger>
		<Tabs.Trigger value="likes" class="data-[state=active]:bg-background data-[state=active]:shadow-sm">
			<Heart class="w-4 h-4 mr-2" /> Likes
		</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="rentals" class="space-y-4 outline-none">
		{#if rentals.length === 0}
			<div class="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-xl">
				No active rentals. Go find something to watch!
			</div>
		{:else}
			{#each rentals as rental (rental.$id)}
				<ProfileMovieCard 
					movie={rental.movie} 
					subtext={getExpiryText(rental.expiresAt)}
					isRental={true}
					onAction={onMovieSelect} 
				/>
			{/each}
		{/if}
	</Tabs.Content>

	<Tabs.Content value="wishlist" class="space-y-4 outline-none">
		{#if wishlists.length === 0}
			<div class="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-xl">
				Your wishlist is empty.
			</div>
		{:else}
			{#each wishlists as item (item.$id)}
				<ProfileMovieCard 
					movie={item.movie} 
					subtext={`Added ${new Date(item.timestamp).toLocaleDateString()}`}
					onAction={onMovieSelect} 
				/>
			{/each}
		{/if}
	</Tabs.Content>

	<Tabs.Content value="likes" class="space-y-4 outline-none">
		{#if likes.length === 0}
			<div class="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-xl">
				You haven't liked any movies yet.
			</div>
		{:else}
			{#each likes as item (item.$id)}
				<ProfileMovieCard 
					movie={item.movie} 
					onAction={onMovieSelect} 
				/>
			{/each}
		{/if}
	</Tabs.Content>
</Tabs.Root>
