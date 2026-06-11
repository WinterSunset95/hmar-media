<script lang="ts">
  import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
  import { auth } from "$lib/stores/auth.svelte";

  const handleLogout = async () => {
    await auth.logout()
    goto('/home')
  }
</script>

<div class="flex w-full justify-center items-center p-32 text-2xl">
  This page has not yet been implemented
</div>
<div class="flex w-full justify-center items-center p-32 text-2xl">
  <Button class="" onclick={handleLogout} disabled={false}>
    Logout
  </Button>
</div>
