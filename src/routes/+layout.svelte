<script lang="ts">
  import "../app.css"
  import { auth } from "$lib/stores/auth.svelte";
  let { data, children } = $props();
  import { Toaster } from "$lib/components/ui/sonner";
  import { onMount } from "svelte";
  import { App } from '@capacitor/app'

  $effect(() => {
    auth.user = data.account;
  })

  onMount(() => {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back()
      } else {
        App.exitApp();
      }
    })
  })
</script>

<Toaster />
{@render children()}
