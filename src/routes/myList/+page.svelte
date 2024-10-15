<!-- MovieList.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import Card from "$lib/components/Card.svelte";
  import { browser } from "$app/environment";
  import { favoriteListRefresh } from "$lib/store/globalState";
  import type { Movie } from "$lib/types/tmdb";

  let movies: Movie[] = [];

  onMount(() => {
    if (browser) {
      // Initialize movies from localStorage
      movies = JSON.parse(localStorage.getItem("list") || "[]");
      console.log(localStorage.getItem("list"));

      // Subscribe to the store and update movies when it changes
      const unsubscribe = favoriteListRefresh.subscribe(() => {
        movies = JSON.parse(localStorage.getItem("list") || "[]");
      });

      // Clean up the subscription when the component is destroyed
      return () => {
        unsubscribe();
      };
    }
  });
</script>

<div class="absolute top-36 flex flex-wrap left-12 gap-4">
  {#if movies.length > 0}
    {#each movies as item}
      <Card {item} />
    {/each}
  {:else}
    <p class="text-white text-xl">No movies in your list.</p>
  {/if}
</div>
