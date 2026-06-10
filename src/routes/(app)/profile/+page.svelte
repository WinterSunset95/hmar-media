<script lang="ts">
	import { Button } from '$lib/components/ui/button';
  import { auth } from "$lib/stores/auth.svelte";

  const handleLogout = async () => {
    auth.logout()
  }

</script>

<div>
  Hello from the profile page
</div>
<Button onclick={handleLogout}>Logout</Button>
