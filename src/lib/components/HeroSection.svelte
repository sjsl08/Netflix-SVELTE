<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Play, Info, Volume2, VolumeOff } from "lucide-svelte";
  import {
    popularShows
  } from "$lib/store/globalState";
  import { page } from "$app/stores";
  import Player from "./Player.svelte";
  import type PlayerComponent from "./Player.svelte";
  import { openModal } from '$lib/store/globalState';
  import { goto } from "$app/navigation";

  interface Movie {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    overview: string;
  }

  interface Video {
    key: string;
    type: string;
  }

  interface MovieDetails {
    overview: string;
    videos: {
      results: Video[];
    };
    title?: string;
    name?: string;
    id:string
  }

  let id: string = "";
  let movie: Movie | null = null;
  let trailerUrl: string = "";
  let movieDetails: MovieDetails | null = null;
  let isTvShowsRoute: boolean = false;

  // Reference to the Player component
  let playerRef: PlayerComponent | null = null;
  let isMutedPlayer1: boolean = true;

  // Determine if current route is /tvShows
  $: isTvShowsRoute = $page.url.pathname === "/tvShows";

  let unsubscribeShows: () => void;
  let unsubscribeGenres: () => void;

  onMount(() => {
    if (isTvShowsRoute) {
      unsubscribeShows = popularTVShows.subscribe((shows) => {
        if (shows.length > 0) {
          const randomIndex = Math.floor(Math.random() * shows.length);
          movie = shows[randomIndex];
          fetchDetailsAndInitializePlayer(movie);
        }
      });
    } else {
      unsubscribeShows = popularShows.subscribe((shows) => {
        if (shows.length > 0) {
          const randomIndex = Math.floor(Math.random() * shows.length);
          movie = shows[randomIndex];
          fetchDetailsAndInitializePlayer(movie);
        }
      });
    }

    // Cleanup subscriptions and destroy player
    return () => {
      if (unsubscribeShows) unsubscribeShows();
      
    };
  });

  async function fetchDetailsAndInitializePlayer(selectedMovie: Movie) {
    await fetchDetails(selectedMovie);
  }

  async function fetchDetails(selectedMovie: Movie) {
    const apiKey = "920a7b538bfb15120fe9dc6ced7735b0";
    const url = isTvShowsRoute
      ? `https://api.themoviedb.org/3/tv/${selectedMovie.id}?api_key=${apiKey}&append_to_response=videos`
      : `https://api.themoviedb.org/3/movie/${selectedMovie.id}?api_key=${apiKey}&append_to_response=videos`;

    try {
      const response = await fetch(url);
      const details: MovieDetails = await response.json();
      movieDetails = details;

      console.log(movieDetails);
      

      const trailer = details.videos.results.find(
        (video) =>
          video.type === "Trailer" || video.type === "Opening Credits"
      );

      if (trailer) {
        id = trailer.key;
        trailerUrl = `https://www.youtube.com/embed/${trailer.key}?enablejsapi=1&autoplay=1&loop=1&playlist=${trailer.key}&controls=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&rel=0&vq=hd2160`;
      } else {
        trailerUrl = "";
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  }

  const handleMute = () => {
    console.log("Parent: Video has been muted.");
    isMutedPlayer1 = true;
    // Additional logic if needed
  };

  const handleUnmute = () => {
    console.log("Parent: Video has been unmuted.");
    isMutedPlayer1 = false;
    // Additional logic if needed
  };
</script>

<main class="relative overflow-hidden ">
  {#if trailerUrl}
    <Player
      videoId={id}
      bind:this={playerRef}
      on:mute={handleMute}
      on:unmute={handleUnmute}
    />
  {/if}

  {#if !trailerUrl && movie}
    <img
      src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
      alt={movie.title || movie.name}
      class="h-screen w-full object-cover absolute inset-0"
    />
  {/if}

  <!-- Gradient Overlays -->
  <div class="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent"></div>
  {#if !trailerUrl}
    <div class="absolute inset-0 bg-gradient-to-r from-[#141414] to-transparent"></div>
  {/if}

  <!-- Movie Details and Controls -->
  {#if movie}
    <div class="absolute top-[45%] pl-12 w-full z-10">
      <h1 class="text-4xl md:text-6xl font-bold mb-4 text-white">
        {movie.title || movie.name}
      </h1>
      <p class="text-sm md:text-lg hidden  md:block mb-6 max-w-lg text-gray-300">

        {movieDetails ? movieDetails.overview?.substring(0,150) + "..." : movie.overview?.substring(0,150) + "..."}
      </p>
      <div class="flex flex-wrap items-center space-x-4 space-y-2 md:space-y-0">

        <div class="flex gap-4">

          <!-- Play Button -->
          <button on:click={goto(`/watch/${movie.id}`)} class="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition">
            <Play size={20} />
            <span class="font-semibold">Play</span>
          </button>
          
          <!-- More Info Button -->
          <button on:click={()=>{openModal(trailerUrl,movieDetails?.id  )}} class="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
            <Info size={20} />
            <span class="font-semibold">More Info</span>
          </button>
        </div>

        <!-- Mute/Unmute Button -->
         <div class="absolute right-0 flex items-center gap-4">

           <button
           on:click={() => {
             if (playerRef) {
               playerRef.toggleMute();
              }
            }}
          class="flex items-center gap-2 p-4 border-2 text-white rounded-full transition"
          >
          {#if isMutedPlayer1}
          <VolumeOff size={20} />
          {:else}
          <Volume2 size={20} />
          {/if}
        </button>
        
        <!-- Age Rating Badge -->
        <div class="bg-gray-600 bg-opacity-60 text-white border-l-2 px-3 py-2 ">
          <span>18+</span>
        </div>
      </div>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    font-family: 'Arial', sans-serif;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }
    p {
      font-size: 1rem;
    }
    .controls button {
      padding: 0.5rem 1rem;
    }
  }
</style>
