<script lang="ts">
	import { page } from '$app/stores';
	// Make sure you install lucide-svelte for these icons
	import { Home, Flame, User } from '@lucide/svelte';

	let { children } = $props();

	// We derive the active path so our tabs know when to glow red
	let currentPath = $derived($page.url.pathname);

	const tabs = [
		{ name: 'Home', path: '/home', icon: Home },
		{ name: 'New & Hot', path: '/hot', icon: Flame },
		{ name: 'My Profile', path: '/profile', icon: User }
	];
</script>

<div class="flex flex-col h-[100dvh] w-full overflow-hidden bg-background">
	
	<main class="flex-1 overflow-y-auto relative z-0 pb-4">
		{@render children()}
	</main>

	<nav class="shrink-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-50 pb-[env(safe-area-inset-bottom)]">
		<div class="flex h-16 items-center justify-around px-2">
			{#each tabs as tab}
				<a
					href={tab.path}
					class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors {currentPath.startsWith(tab.path) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}"
				>
					<div class="relative flex items-center justify-center">
						<svelte:component this={tab.icon} class="w-6 h-6 transition-transform {currentPath.startsWith(tab.path) ? 'scale-110' : 'scale-100'}" />
						</div>
					
					<span class="text-[10px] font-medium tracking-wide">
						{tab.name}
					</span>
				</a>
			{/each}
		</div>
	</nav>
</div>
