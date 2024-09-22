<script lang="ts">
    import { onMount } from 'svelte';
    import { Play, Info, VolumeX, Volume2 } from "lucide-svelte";
    import { topRatedShows,trendingShows,popularShows } from "$lib/store/globalState";
    import Button from "$lib/components/Button.svelte";
  
    let movie = null; // Initialize movie as null
    let trailerUrl = '';
    let isMuted = true;
    let movieDetails = null; // Variable to hold detailed movie info from TMDB
  
    // Subscribe to topRatedShows store
    popularShows.subscribe(shows => {
        console.log(shows);
        
      if (shows.length > 0) {
        movie = shows[0]; // Select the first top-rated show for now
      }
    });

    
  
    onMount(async () => {
      if (movie) {
        console.log(movie);
        
        // Fetch trailer
        const trailerResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=920a7b538bfb15120fe9dc6ced7735b0`);
        const trailerData = await trailerResponse.json();
        const trailer = trailerData.results.find(video => video.type === 'Trailer');
        if (trailer) {
          trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&modestbranding=1&showinfo=0&iv_load_policy=3&cc_load_policy=0&rel=0`;
        }
  
        // Fetch detailed movie info
        const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=920a7b538bfb15120fe9dc6ced7735b0`);
        movieDetails = await detailsResponse.json();
      }
    });
  
    function toggleMute() {
        isMuted = !isMuted;
        trailerUrl = trailerUrl.replace(/mute=\d/, `mute=${isMuted ? 1 : 0}`);
        console.log(trailerUrl);
        
    }

  </script>
  
  <main class="relative overflow-hidden">
    {#if trailerUrl}
      <iframe   
        src={trailerUrl}
        frameborder="0"
        allow="autoplay; encrypted-media"
        class="pointer-events-none scale-150 absolute inset-0 w-full h-full object-cover"
      ></iframe>
    {/if}
    
    {#if !trailerUrl && movie}
      <img 
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} 
        alt={movie.title} 
        class="h-[90vh] w-full object-cover absolute inset-0 object-cover"
      />
    {/if}
    
    <div class="absolute  inset-0 bg-gradient-to-t from-#141414 to-transparent"></div>
    {#if !trailerUrl}
      <div class="absolute inset-0 bg-gradient-to-r from-#141414 to-transparent"></div>
    {/if}
    
    <div class="absolute top-60 left-10 max-w-xl z-10">
      {#if movie}
        <h1 class="text-5xl font-bold mb-4">{movie.title}</h1>
        <p class="text-lg mb-6 ">
          {movieDetails ? movieDetails.overview : movie.overview}
        </p>
       
      {/if}
      <div class="flex space-x-4 items-center">
        <Button>
          <Play color="black" class="mr-2 h-8 w-8" /> Play
        </Button>
        <Button variant="outline">
          <Info class="mr-2 h-4 w-4" /> More Info
        </Button>
        <Button variant="outline" on:click={toggleMute}>
          {#if isMuted}
            <VolumeX class="h-4 w-4" />
          {:else}
            <Volume2 class="h-4 w-4" />
          {/if}
        </Button>
      </div>
    </div>
  </main>
  
  <style>
    main {
      position: relative;
      height: 100vh;
      overflow: hidden;
    }
    iframe, img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, black, transparent);
    }
  </style>
  