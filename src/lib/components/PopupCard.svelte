<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { ChevronDown, Play, Plus, Check, ThumbsUp } from "lucide-svelte";
  import { cardState, openModal } from "$lib/store/globalState";
  import { getMovieTrailer } from "$lib/api/tmdb";
  import YouTubePlayer from "./YouTubePlayer.svelte";
  import { get } from "svelte/store";
  import { browser } from "$app/environment";
  import { Volume2, VolumeOff } from "lucide-svelte";
  import { addToList, getList } from "$lib/utils/helpers";
  import Player from "./Player.svelte";
  import { goto } from "$app/navigation";
  import fallbackImage from "../../public/images/404.jpg";

  export let x: number = 0;
  export let y: number = 0;
  export let dimensions: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  export let isHovered: boolean = false; // External hover state

  let isPopoverHovered: boolean = false; // Internal hover state
  let showTrailer: boolean = false; // Determines whether to show trailer or image
  let trailerUrl: string = "";
  let imageUrl: string = "";
  let title: string = "";
  let favData;
  let allList;
  let added = false;
  let movieID: string = "";

  // Determine whether to show the popover
  $: showPopover = isHovered || isPopoverHovered;

  let unsubscribe: () => void;

  // Subscribe to cardState to get image URL
  cardState.subscribe((data) => {
    if (data.item) {
      imageUrl = data.item.image;
      movieID = data.item.id;
      title = data.item.title;
      favData = data.item;
      console.log(favData);

      allList = JSON.parse(localStorage.getItem("list")!);

    added =  allList?.some((item)=>{
       return item.id === movieID
        
      })

      console.log(added);

      // added = allList.some((item) => item.id === favData.item.id);
    } else {
      imageUrl = "";
    }
  });

  function handleError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src !== fallbackImage) {
      img.src = fallbackImage;
    }
  }

  // Function to fetch the trailer
  async function fetchTrailer(movieId: number) {
    console.log(x, window.innerWidth);

    try {
      const trailer = await getMovieTrailer(movieId);
      // console.log('Fetched Trailer:', trailer);
      if (trailer && trailer.key) {
        trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}`;
      } else {
        trailerUrl = "";
        // console.error('Trailer not found or key is missing.');
      }
      // console.log('Trailer URL:', trailerUrl);
    } catch (error) {
      // console.error('Error fetching trailer:', error);
      trailerUrl = "";
    }
  }

  onMount(() => {
    if (browser) {
      // Initial fetch if item exists
      if (cardState && cardState.item?.id) {
        fetchTrailer(cardState.item.id);
      }

      // Subscribe to changes in cardState
      unsubscribe = cardState.subscribe((state) => {
        if (state.item?.id) {
          fetchTrailer(state.item.id);
        } else {
          trailerUrl = "";
        }
      });

      // Add scroll listener to hide popover on scroll
      window.addEventListener("scroll", handleScroll);
      allList = [];

      
      
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("scroll", handleScroll);
    }
    if (unsubscribe) {
      unsubscribe();
    }
  });

  // Handle mouse enter on popover container
  function handlePopoverMouseEnter() {
    isPopoverHovered = true;
  }

  // Handle mouse leave on popover container
  function handlePopoverMouseLeave() {
    isPopoverHovered = false;
    showTrailer = false; // Reset trailer state on mouse leave
  }

  // Handle mouse enter on image to show trailer
  function handleImageMouseEnter() {
    showTrailer = !showTrailer;
  }
  function handleImageMouseEnterAction() {
    showTrailer = false;
  }

  // Handle mouse leave on image to show image again
  function handleImageMouseLeave() {
    showTrailer = false;
  }

  // Handle scroll event to hide popover
  function handleScroll() {
    isHovered = false;
    isPopoverHovered = false;
    showTrailer = false;
  }

  let player;
  let muted = true;

  // Debugging
  // $: console.log('isHovered:', isHovered, 'isPopoverHovered:', isPopoverHovered, 'showPopover:', showPopover, 'showTrailer:', showTrailer);

  function muteVideo() {
    if (player) {
      player.mute();
    }
  }

  function unmuteVideo() {
    if (player) {
      player.unmute();
    }
  }

  function toggleMuteVideo() {
    console.log("gsdsf");
    
    if (player) {
      muted = !muted;

      player.toggleMute();
    }
  }
</script>

<!-- PopupCard Container -->
<div
  class="popup-card z-40 flex flex-col transition-all duration-300 {showPopover
    ? 'popup-scale-up opacity-100'
    : 'popup-scale-down opacity-0'}"
  style="position: fixed; top: {y}px; left: {x < 200
    ? x + 60
    : window.innerWidth - x < 200
      ? x - 120
      : x}px; width: 350px; z-index: 1000; overflow:hidden;"
  on:mouseenter={handlePopoverMouseEnter}
  on:mouseleave={handlePopoverMouseLeave}
>
  <!-- Trailer or Placeholder Image -->
  <div class="relative w-full">
    <div class="flex items-center">
      <p class="absolute text-ellipsis z-50 top-36 left-2 font-light text-xl">
        {title}
      </p>
      <span
        on:click={toggleMuteVideo}
        class="absolute cursor-pointer z-50 transition-colors duration-200 top-36 right-4 p-3 border-2 border-2 border-gray-700 hover:border-white rounded-full"
      >
        {#if !muted}
          <Volume2 />
        {:else}
          <VolumeOff />
        {/if}
      </span>
    </div>
    {#if trailerUrl && showPopover && showTrailer}
      <div class="pointer-events-none">
        <Player bind:this={player} mute={muted} videoId={trailerUrl} />
      </div>
      <!-- <YouTubePlayer bind:this={player} height={200} url={trailerUrl} /> -->
    {:else if imageUrl && showPopover}
      <img
        on:error={handleError}
        on:mouseenter={handleImageMouseEnter}
        src={imageUrl}
        alt="Poster"
        class="w-full h-[200px] object-cover"
      />

      <span class="absolute top-40 right-0"> </span>
    {:else}
      <div
        class="w-full h-[200px] bg-gray-500 flex items-center justify-center"
      >
        <span class="text-white text-sm">No Image Available</span>
      </div>
    {/if}
  </div>

  <!-- Action buttons -->
  <div
    on:mouseenter={handleImageMouseEnterAction}
    class="flex justify-between items-center p-4"
  >
    <div class="flex space-x-2">
      <button
        on:click={goto(`/watch/${movieID}`)}
        class="rounded-full transition-colors duration-200 p-3 border-2 border-gray-700 hover:border-white"
      >
        <Play class="text-white h-6 w-6" />
      </button>
      <button
      on:click={ () =>{
        added = !added
        addToList(favData)}}
      class="rounded-full transition-colors duration-200 p-3 border-2 border-gray-700 hover:border-white"
      aria-label="Add to List"
      >
      {#if added}
      <Check class="text-white h-6 w-6" />
      {:else}
      <Plus class="text-white h-6 w-6" />
      {/if}

        </button>
      <button
        class="rounded-full transition-colors duration-200 p-3 border-2 border-gray-700 hover:border-white"
      >
        <ThumbsUp class="text-white h-6 w-6" />
      </button>
    </div>
    <button
      on:click={() => {
        openModal(trailerUrl, movieID);
      }}
      class="rounded-full transition-colors duration-200 p-3 border-2 border-gray-700 hover:border-white"
    >
      <ChevronDown class="text-white h-6 w-6" />
    </button>
  </div>

  <!-- Movie information -->
  <div class=" p-4">
    <div class="flex gap-3">
      <span class="text-green-400">79% Match</span>
      <span class="border-2 border-gray-600 rounded-sm text-sm">13 +</span>
      <span class="font-bold">21m</span>
      <span class="border-2 border-gray-600 rounded-sm text-sm">HD</span>
    </div>
    <div class=" mt-2 text-lg flex space-x-2">
      <span>Witty • Heartfelt • Dramedy</span>
    </div>
  </div>
</div>

<style>
  /* Base Styles for PopupCard */
  .popup-card {
    background-color: rgb(20, 20, 20);

    color: rgb(255, 255, 255);

    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 2px 1px 1px,
      rgba(0, 0, 0, 0.14) 0px 1px 1px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;

    background-image: linear-gradient(
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.05)
    );

    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    transform-origin: center;
  }

  /* Transition Classes */
  .transition-all {
    transition:
      transform 0.3s ease 0.1s,
      opacity 0.3s ease;
  }

  /* Scale Down (Initial State) */
  .popup-scale-down {
    transform: translate(-50%, -100%) scale(0.1);
    opacity: 0;
  }

  /* Scale Up (Hovered State) */
  .popup-scale-up {
    transform: translate(-50%, -100%) scale(1);
    opacity: 1;
  }

  /* Opacity Classes */
  .opacity-0 {
    opacity: 0;
  }

  .opacity-100 {
    opacity: 1;
  }

  /* Responsive Iframe */
  iframe {
    width: 100%;
    height: 100%;
  }

  /* Optional: Improve Image Loading */
  img {
    display: block;
  }

  /* Hover Effects for Buttons */
  button:hover {
    cursor: pointer;
  }
</style>
