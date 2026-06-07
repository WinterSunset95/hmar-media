<script lang="ts">
  import "../../app.css";
  import { client } from "$lib/appwrite";
  import { AppwriteException } from "appwrite";
  import {
    PUBLIC_APPWRITE_ENDPOINT,
    PUBLIC_APPWRITE_PROJECT_ID,
    PUBLIC_APPWRITE_PROJECT_NAME,
  } from "$env/static/public";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import appwriteSvg from "../../../static/appwrite-icon.svg";
  import svelteSvg from "../../../static/svelte.svg";

  let detailHeight = writable(0);

  let detailsRef: HTMLElement | null = null;

  function handleDetailHeight() {
    detailHeight.set(detailsRef ? detailsRef.clientHeight : 0);
  }

  onMount(() => {
    handleDetailHeight();
  });

  type LogEntry = {
    date: Date;
    method: string;
    path: string;
    response: string;
    status: number;
  };

  let logs = $state<Array<LogEntry>>([]);
  let status = $state<"idle" | "loading" | "success" | "error">("idle");
  let showLogs = $state(false);

  async function sendPing() {
    if (status === "loading") return;
    status = "loading";
    try {
      /* @ts-ignore */
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      logs = [log, ...logs];
      status = "success";
    } catch (err) {
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: err instanceof AppwriteException ? err.code : 500,
        response:
          err instanceof AppwriteException
            ? err.message
            : "Something went wrong",
      };
      logs = [log, ...logs];
      status = "error";
    } finally {
      showLogs = true;
      requestAnimationFrame(() => {
        handleDetailHeight();
      });
    }
  }
</script>

<svelte:window on:resize={handleDetailHeight} />
<svelte:head>
  <title>Hmar Media</title>
</svelte:head>

<main
  class="checker-background flex flex-col items-center p-5"
  style={`margin-bottom: ${$detailHeight}px`}
></main>
