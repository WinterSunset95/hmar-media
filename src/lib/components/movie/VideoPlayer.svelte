<script lang="ts">
	import videojs from 'video.js';
	import 'video.js/dist/video-js.css';
	// Apply an explicit dark cinematic theme override
	import '@videojs/themes/dist/city/index.css'; 
	
	let { src, poster = "" } = $props<{
		src: string;
		poster?: string;
	}>();

	let videoElement = $state<HTMLVideoElement | null>(null);
	let player: ReturnType<typeof videojs>;

	$effect(() => {
		// Svelte 5 mounts the DOM node, now we hand control over to Video.js
		if (videoElement) {
			player = videojs(videoElement, {
				controls: true,
				autoplay: false,
				preload: 'auto',
				fluid: true,
				poster: poster,
				// This specifically tells Video.js to expect an HLS manifest
				sources: [{
					src: src,
					type: 'application/x-mpegURL'
				}],
				controlBar: {
					pictureInPictureToggle: false, // Turn off PIP unless you explicitly want it
				}
			});

			player.on('ready', () => {
				console.log('Video.js Engine Online. Decrypting HLS stream.');
			});

			player.on('error', () => {
				console.error('Video.js encountered a playback error:', player.error());
			});
		}

		// The Cleanup Function: 
		// If you don't call player.dispose() when the user hits the back button, 
		// Video.js will leave ghost event listeners in the browser's RAM until it crashes.
		return () => {
			if (player) {
				player.dispose();
			}
		};
	});
</script>

<!-- 
	The vjs-theme-city adds a cleaner, modern look out-of-the-box compared to the default skin.
	vjs-big-play-centered puts the play button dead center like Netflix. 
-->
<div class="w-full h-full flex items-center justify-center bg-black">
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={videoElement}
		class="video-js vjs-big-play-centered vjs-theme-city w-full h-full object-contain"
		crossorigin="anonymous"
	></video>
</div>

<style>
	/* Force Video.js to respect our absolute full-height container instead of letterboxing weirdly */
	:global(.video-js) {
		width: 100% !important;
		height: 100% !important;
	}
	
	/* Tweak the primary color of the Video.js progress bar to match our Shadcn theme (Rose 600) */
	:global(.vjs-theme-city .vjs-play-progress) {
		background-color: hsl(346 87% 43%) !important;
	}
</style>
