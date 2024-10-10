<!-- MovieList.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card.svelte';
    import { browser } from '$app/environment';
  import Carousel from '$lib/components/Carousel.svelte';
  import { favoriteListRefresh } from '$lib/store/globalState';
  
    let movies: any[] = [];
  
    onMount(() => {
        if(browser){
            movies = JSON.parse(localStorage.getItem('list') || '[]');
            console.log(localStorage.getItem('list'));
            
        }
    });

    favoriteListRefresh.subscribe(()=>{
      movies = JSON.parse(localStorage.getItem('list') || '[]');
    })

    
  </script>
  
  <div class="absolute top-36 left-12 flex gap-4">
  {#if movies.length > 0}
    <Carousel items={movies}/>
    {:else}
    <p class="text-white text-xl">No movies in your list.</p>
    {/if}
  </div>
  