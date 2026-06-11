<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="space-y-8 p-4">
	{#each Array(3) as _}
		<Card.Root class="overflow-hidden border-border bg-card">
			<!-- Image Placeholder -->
			<Skeleton class="w-full h-64 sm:h-80 rounded-none" />
			
			<Card.Content class="p-5 space-y-4">
				<div class="flex justify-between items-start">
					<div class="space-y-2 w-full">
						<!-- Title & Badge -->
						<div class="flex items-center gap-3">
							<Skeleton class="h-8 w-3/4" />
							<Skeleton class="h-5 w-12 rounded-full" />
						</div>
						<!-- Date -->
						<Skeleton class="h-4 w-1/3" />
					</div>
				</div>

				<!-- Synopsis -->
				<div class="space-y-2">
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-5/6" />
					<Skeleton class="h-4 w-4/6" />
				</div>

				<!-- Actions -->
				<div class="flex gap-3 pt-2">
					<Skeleton class="h-10 flex-1 rounded-md" />
					<Skeleton class="h-10 w-12 rounded-md" />
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
