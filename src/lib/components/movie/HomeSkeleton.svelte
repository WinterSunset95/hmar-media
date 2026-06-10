<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<!-- Premium Netflix-style Shimmer skeletons using standard shadcn design tokens -->
<div class="w-full min-h-screen pb-24 text-foreground bg-background select-none">
	
	<!-- Hero Spotlight Shimmer -->
	<div class="relative w-full h-[55vh] sm:h-[70vh] flex flex-col justify-end p-6 overflow-hidden">
		<!-- Background ambient gradient mirroring the poster's native falloff layout -->
		<div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
		
		<div class="relative z-10 space-y-4 max-w-xl">
			<!-- Title placeholder -->
			<Skeleton class="w-1/3 h-8 sm:h-12 rounded-lg" />
			
			<!-- Synopsis rows -->
			<div class="space-y-2">
				<Skeleton class="w-full h-4 rounded-md" />
				<Skeleton class="w-11/12 h-4 rounded-md" />
				<Skeleton class="w-3/4 h-4 rounded-md" />
			</div>
			
			<!-- Play/Info button row -->
			<div class="flex gap-3 pt-2">
				<Skeleton class="w-28 h-10 rounded-md" />
				<Skeleton class="w-28 h-10 rounded-md" />
			</div>
		</div>
	</div>

	<!-- Slider Rows Shimmers -->
	<div class="mt-8 px-4 space-y-8">
		{#each Array(2) as _}
			<div class="space-y-3">
				<!-- Segment Title (e.g. "New & Hot") -->
				<Skeleton class="w-40 h-6 rounded-md" />
				
				<!-- Row cards layout -->
				<div class="flex gap-4 overflow-x-hidden">
					{#each Array(6) as _}
						<Skeleton class="shrink-0 w-32 h-48 sm:w-44 sm:h-64 rounded-md" />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
