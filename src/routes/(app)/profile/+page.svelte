<script lang="ts">
  import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
  import { auth } from "$lib/stores/auth.svelte";

  const handleLogout = async () => {
    await auth.logout()
    goto('/home')
  }
</script>

<div>
  Hello from the profile page
</div>
<Button class="" onclick={handleLogout} disabled={false}>
  Logout
</Button>
