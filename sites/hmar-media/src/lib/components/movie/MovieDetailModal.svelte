<script lang="ts">
	import type { Movie } from '$lib/types';
	import { getPosterUrl } from '$lib/utils/movie';
	import { X, Play, Tv, Check, Plus, AlertCircle } from '@lucide/svelte';

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

	// Derived states tracking active transactions
	let isRented = $derived(movie ? myRentedIds.has(movie.$id) : false);
	let isWishlisted = $derived(movie ? myWishlistIds.has(movie.$id) : false);
</script>

{#if show && movie}
	<!-- Backdrop overlay with glassmorphism blur -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div 
		class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity animate-in fade-in duration-200"
		onclick={onClose}
		role="dialog"
	>
		<!-- Modal Content Box with sliding animations -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="relative w-full sm:max-w-xl bg-background border-t sm:border border-border/80 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-transform duration-300 translate-y-0"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Close key -->
			<button 
				onclick={onClose}
				class="absolute top-4 right-4 z-50 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
			>
				<X class="w-5 h-5" />
			</button>

			<!-- Media Banner Header -->
			<div 
				class="relative w-full h-48 sm:h-64 bg-cover bg-center shrink-0"
				style="background-image: linear-gradient(to top, var(--background) 0%, rgba(0,0,0,0) 100%), url({getPosterUrl(movie)});"
			>
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
						<button class="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black py-3 rounded-lg font-bold text-sm transition-all shadow">
							<Play class="w-4 h-4 fill-black" />
							Watch Film
						</button>
					{:else}
						<button 
							onclick={() => onRent(movie!)}
							class="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)]"
						>
							<Tv class="w-4 h-4" />
							Rent for ₹{movie.rentPrice / 100}
						</button>
					{/if}

					<!-- Wishlist modifier button -->
					<button 
						onclick={() => onToggleWishlist(movie!)}
						disabled={isInteractionLoading}
						class="px-4 py-3 rounded-lg bg-muted border border-border hover:bg-muted/80 text-foreground flex items-center justify-center transition-colors disabled:opacity-50"
						title="Toggle Wishlist"
					>
						{#if isWishlisted}
							<Check class="w-5 h-5 text-primary" />
						{:else}
							<Plus class="w-5 h-5" />
						{/if}
					</button>
				</div>
				
				{#if !isRented}
					<div class="flex items-start gap-2 text-xs text-muted-foreground bg-muted/10 p-3 rounded border border-border/20">
						<AlertCircle class="w-4 h-4 text-primary shrink-0 mt-0.5" />
						<span>Once rented, this movie will remain available under "My Profile" for streaming on any connected device for 48 hours.</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
