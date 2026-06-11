<script lang="ts">
	import type { Movie } from '$lib/types';
	import { getPosterUrl } from '$lib/utils/movie';
	import { X, Play, Tv, Check, Plus, AlertCircle } from '@lucide/svelte';
	
	// Shadcn Component Imports
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';

	let { 
		movie, 
		show, 
		myRentedIds, 
		myWishlistIds, 
		isInteractionLoading, 
		onClose, 
		onRent, 
		onToggleWishlist 
	} = $props<{
		movie: Movie | null;
		show: boolean;
		myRentedIds: Set<string>;
		myWishlistIds: Set<string>;
		isInteractionLoading: boolean;
		onClose: () => void;
		onRent: (movie: Movie) => void;
		onToggleWishlist: (movie: Movie) => void;
	}>();

	let isRented = $derived(movie ? myRentedIds.has(movie.$id) : false);
	let isWishlisted = $derived(movie ? myWishlistIds.has(movie.$id) : false);

	// Intercept the Drawer's internal open state to sync with our Svelte controller
	function handleOpenChange(isOpen: boolean) {
		if (!isOpen) onClose();
	}
</script>

<Drawer.Root open={show} onOpenChange={handleOpenChange}>
	<Drawer.Portal>
		<Drawer.Overlay class="fixed inset-0 bg-black/80 backdrop-blur-md" />
		<Drawer.Content class="bg-background flex flex-col fixed bottom-0 left-0 right-0 max-h-[90vh] mx-auto sm:max-w-xl rounded-t-2xl border-border/80 outline-none overflow-hidden">
			
			{#if movie}
				<!-- Screen Reader Accessibility Requirements -->
				<Drawer.Title class="sr-only">{movie.title}</Drawer.Title>
				<Drawer.Description class="sr-only">{movie.description}</Drawer.Description>

				<!-- The Vaul Drag Handle -->
				<div class="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-12 h-1.5 bg-white/30 rounded-full"></div>

				<!-- Media Banner Header -->
				<div 
					class="relative w-full h-48 sm:h-64 bg-cover bg-center shrink-0"
					style="background-image: linear-gradient(to top, var(--background) 0%, rgba(0,0,0,0) 100%), url({getPosterUrl(movie)});"
				>
					<!-- Fallback close button for desktop users who don't swipe -->
					<div class="absolute top-4 right-4 z-50">
						<Button variant="secondary" size="icon" class="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white border-0 backdrop-blur-sm" onclick={onClose}>
							<X class="w-4 h-4" />
						</Button>
					</div>

					<div class="absolute bottom-4 left-4 z-10">
						<h4 class="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
							{movie.title}
						</h4>
					</div>
				</div>

				<!-- Body Details -->
				<div class="p-6 overflow-y-auto space-y-6">
					
					<!-- Synopsis -->
					<div class="space-y-2">
						<span class="text-xs font-bold text-primary tracking-wide uppercase">Synopsis</span>
						<p class="text-sm text-muted-foreground leading-relaxed">
							{movie.description}
						</p>
					</div>

					<!-- Info Box -->
					<div class="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg text-sm border border-border/40">
						<div class="space-y-1">
							<span class="text-xs text-muted-foreground block">Release Date</span>
							<span class="font-semibold">
								{new Date(movie.releaseDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
							</span>
						</div>
						<div class="space-y-1">
							<span class="text-xs text-muted-foreground block">Access Status</span>
							<span class="font-semibold text-primary">{isRented ? 'Rented (Active)' : 'Locked'}</span>
						</div>
					</div>

					<!-- Action Row -->
					<div class="flex items-center gap-3 pt-2">
						{#if isRented}
							<Button variant="secondary" class="flex-1 h-12 font-bold shadow-sm text-black bg-white hover:bg-white/90">
								<Play class="w-4 h-4 mr-2 fill-black" />
								Watch Film
							</Button>
						{:else}
							<Button 
								class="flex-1 h-12 font-bold shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all"
								onclick={() => onRent(movie!)}
							>
								<Tv class="w-4 h-4 mr-2" />
								Rent for ₹{movie.rentPrice / 100}
							</Button>
						{/if}

						<Button 
							variant="outline"
							size="icon"
							class="h-12 w-12 shrink-0 border-border bg-muted/50 hover:bg-muted"
							onclick={() => onToggleWishlist(movie!)}
							disabled={isInteractionLoading}
							title="Toggle Wishlist"
						>
							{#if isWishlisted}
								<Check class="w-5 h-5 text-primary" />
							{:else}
								<Plus class="w-5 h-5" />
							{/if}
						</Button>
					</div>
					
					{#if !isRented}
						<div class="flex items-start gap-2 text-xs text-muted-foreground bg-muted/10 p-3 rounded border border-border/20">
							<AlertCircle class="w-4 h-4 text-primary shrink-0 mt-0.5" />
							<span>Once rented, this movie will remain available under "My Profile" for streaming on any connected device for 48 hours.</span>
						</div>
					{/if}
				</div>
			{/if}
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
