<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="space-y-6 max-w-3xl mx-auto w-full">
	<div class="flex items-center gap-4 mb-8">
		<Skeleton class="w-20 h-20 rounded-full" />
		<div class="space-y-2 flex-1">
			<Skeleton class="h-8 w-48" />
			<Skeleton class="h-4 w-32" />
		</div>
		<Skeleton class="h-10 w-24 rounded-md" />
	</div>

	<Skeleton class="h-10 w-full max-w-md rounded-md mb-6" />

	<div class="space-y-4">
		{#each Array(3) as _}
			<Card.Root class="flex overflow-hidden h-32">
				<Skeleton class="w-24 h-full rounded-none shrink-0" />
				<div class="p-4 flex flex-col justify-between w-full">
					<div class="space-y-2">
						<Skeleton class="h-6 w-3/4" />
						<Skeleton class="h-4 w-1/2" />
					</div>
					<Skeleton class="h-8 w-28 rounded-md" />
				</div>
			</Card.Root>
		{/each}
	</div>
</div>
