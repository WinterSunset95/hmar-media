<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { LogOut, User } from '@lucide/svelte';

	let { name, email, onLogout } = $props<{
		name: string;
		email: string;
		onLogout: () => void;
	}>();

	// Extracts initials for the fallback avatar (e.g., "John Doe" -> "JD")
	let initials = $derived(
		name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
	);
</script>

<div class="flex items-center flex-wrap gap-5 bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
	<Avatar.Root class="w-20 h-20 border-2 border-primary/20">
		<Avatar.Image src={`https://picsum.photos/200`} alt={name} class=""/>
		<Avatar.Fallback class="bg-muted text-lg font-bold text-primary">
			{initials}
		</Avatar.Fallback>
	</Avatar.Root>

	<div class="flex-1">
		<h2 class="text-2xl font-extrabold tracking-tight">{name}</h2>
		<p class="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
			<User class="w-3.5 h-3.5" /> {email}
		</p>
	</div>

	<Button variant="destructive" class="font-bold shadow-sm" onclick={onLogout} disabled={false}>
		<LogOut class="w-4 h-4 mr-2" />
		Logout
	</Button>
</div>
