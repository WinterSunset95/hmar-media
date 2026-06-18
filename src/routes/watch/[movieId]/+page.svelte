<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import { RentalService } from '$lib/services/rentals';
	import { toast } from 'svelte-sonner';
	import { ArrowLeft, Loader2 } from '@lucide/svelte';
	import VideoPlayer from '$lib/components/movie/VideoPlayer.svelte';
  import { MovieService } from '$lib/services/movies';

	let { data } = $props();
	let movie = $derived(data.movie);

	let isLoading = $state(true);
	let hasAccess = $state(false);
	let streamUrl = $state('');

	onMount(async () => {
		// 1. The Bouncer
		if (!auth.user) {
			toast.error("Authentication required to stream.");
			goto('/home');
			return;
		}

		try {
			// 2. The Ledger Verification
			hasAccess = await RentalService.verifyAccess(auth.user.$id, movie.$id);

			if (!hasAccess) {
				toast.error("You do not have an active rental for this movie.");
				goto('/home');
				return;
			}

			if (!movie.streamId) {
				toast.error("This asset has not been uploaded to the media server yet.");
				goto('/home');
				return;
			}

			// 3. The HLS Stream Construction
			streamUrl = MovieService.getStreamingLink(movie);
			// streamUrl = `https://files.vidstack.io/sprite-fight/hls/stream.m3u8`;
      console.log(streamUrl)
      // https://streaming.wintersunset95.in/Items/88b29a353a048422945c3c4951af24f6/Download?api_key=f17139d3d67d4674bb9b7cab917577ac
      // https://streaming.wintersunset95.in/web/#/details?id=88b29a353a048422945c3c4951af24f6&serverId=083da13b7de34056a064e66d0853387b

			/**
			 * CAPACITOR MOBILE HACKS:
			 * When you compile this to Android, you will want to uncomment these lines
			 * to automatically force the phone into landscape mode and hide the status bar.
			 * * import { ScreenOrientation } from '@capacitor/screen-orientation';
			 * import { StatusBar } from '@capacitor/status-bar';
			 * * await ScreenOrientation.lock({ orientation: 'landscape' });
			 * await StatusBar.hide();
			 */

		} catch (error) {
			toast.error("Stream verification failed.");
			goto('/home');
		} finally {
			isLoading = false;
		}
	});

	onDestroy(() => {
		/**
		 * CAPACITOR CLEANUP:
		 * Restore the phone's orientation when they exit the player.
		 * * ScreenOrientation.unlock();
		 * StatusBar.show();
		 */
	});

	function goBack() {
		// Using history.back() instead of goto() preserves their scroll 
		// position on whatever feed they came from.
		history.back();
	}
</script>

<div class="w-full h-[100dvh] bg-black text-white overflow-hidden relative selection:bg-primary/30">
	
	{#if isLoading}
		<div class="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
			<Loader2 class="w-12 h-12 animate-spin text-primary mb-4" />
			<p class="text-sm text-muted-foreground font-mono">Decrypting HLS stream...</p>
		</div>
	{:else if hasAccess}
		
		<!-- Floating Back Button Override -->
		<!-- We set z-[60] so it sits physically above the VideoPlayer's internal controls overlay -->
		<div class="absolute top-4 left-4 sm:top-8 sm:left-8 z-[60] group">
			<button 
				onclick={goBack}
				class="p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
				aria-label="Back to browsing"
			>
				<ArrowLeft class="w-6 h-6 transition-transform group-hover:-translate-x-1" />
			</button>
		</div>

		<!-- The upgraded Video.js Component -->
		<VideoPlayer 
			src={streamUrl} 
			poster={MovieService.getPosterUrl(movie)} 
		/>
		
	{/if}
</div>
