<script lang="ts">
  import { Play, Plus, ThumbsUp, ChevronRight } from "lucide-svelte";
  import { cardState } from "$lib/store/globalState";
  import { onDestroy } from "svelte";

  import fallbackImage from "../../public/images/404.jpg";
  export let item: { id: number; title: string; poster_path: string };

  // Timeout identifier for debounce
  let hoverTimeout: number | undefined;

  // Debounce delay in milliseconds
  const debounceDelay = 0; // Adjust as needed

  // Reactive store value
  $: currentState = $cardState;

  const handleHover = (e: MouseEvent) => {
    e.stopPropagation();

    //console.log("Hovering Card:", item.id);
    //console.log("Current State:", currentState);

    // If this card is already hovered, do nothing
    if (currentState.isHovered && currentState.cardId === item.id) {
      return;
    }

    localStorage.setItem("card", JSON.stringify(item));

    const cardElement = e.currentTarget as HTMLElement;
    const cardRect = cardElement.getBoundingClientRect();

    // Clear any existing timeout to prevent multiple triggers
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // Set a new timeout to update the store after debounceDelay
    hoverTimeout = window.setTimeout(() => {
      cardState.update((state) => ({
        ...state,
        item,
        isHovered: true,
        cardId: item.id,
        position: { x: cardRect.left + cardRect.width / 2, y: cardRect.top },
        dimensions: { width: cardRect.width, height: cardRect.height },
      }));
      hoverTimeout = undefined;
      console.log("Card State Updated:", $cardState);
    }, debounceDelay);
  };

  const handleUnhover = () => {
    //console.log("Unhover detected for Card:", item.id);
    // If the hover timeout is still pending, clear it
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = undefined;
      //console.log("Pending hover timeout cleared.");
    }

    // Update the store to indicate unhover only if this card is currently hovered
    if (currentState.cardId === item.id) {
      cardState.update((state) => ({
        ...state,
        isHovered: false,
        cardId: null,
        dimensions: { width: 0, height: 0 },
      }));
      console.log("Card State Cleared:", $cardState);
    }
  };

  // Clean up the timeout when the component is destroyed
  onDestroy(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
  });

  function handleError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src !== fallbackImage) {
      img.src = fallbackImage;
    }
  }
</script>

<!-- Main Card Container -->

{#if item.poster_path}
  <div
    on:mouseleave={handleUnhover}
    on:mouseenter={handleHover}
    class="card pointer-events-auto relative sm:w-56 w-36"
  >
    <!-- Movie Image -->
    <img
      on:error={handleError}
      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
      alt={item.title}
    />
  </div>
{/if}

<style>
  .card {
    cursor: pointer;
    color: white;
    opacity: 1;
    position: relative; /* Ensure positioning context for info-section */
  }

  .card img {
    width: 100%;
    display: block;
  }

  .info-section {
    padding: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    opacity: 0;
    transition: opacity 0.3s ease; /* Reduced transition time for snappier feel */
    background: rgba(
      0,
      0,
      0,
      0.6
    ); /* Optional: Add background for better visibility */
  }

  .card:hover .info-section {
    opacity: 1;
  }

  .icons-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .icons-row .icon-button {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .icons-row .icon-button:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }

  .tags-row {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }

  .tags-row span {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    z-index: 60;
  }
</style>
