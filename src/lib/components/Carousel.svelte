<script lang="ts">
  import { ChevronLeft, ChevronRight } from "lucide-svelte";
  import Card from "./Card.svelte";
  import type { Movie } from "$lib/types/tmdb";
  
  // Define props with types
  export let title: string = "";
  export let items: Movie[] = [];
  export let scrollAmount: number = 320;
  
  let carouselContainer: HTMLDivElement | null = null;
  let scrollPosition: number = 0;
  
  // Function to scroll left
  const scrollLeft=()=> {
    if (carouselContainer) {
      scrollPosition = Math.max(0, scrollPosition - scrollAmount);
      carouselContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }
  
  // Function to scroll right
  const scrollRight=()=> {
    if (carouselContainer) {
      scrollPosition += scrollAmount;
      carouselContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }
  
  // Update scrollPosition on manual scroll
  const handleScroll=()=> {
    if (carouselContainer) {
      scrollPosition = carouselContainer.scrollLeft;
    }
  }
</script>

<div class="carousel-wrapper">
  <h1 class="mt-4 mb-2 text-white text-2xl font-semibold">{title}</h1>
  
  <div class="carousel-container-wrapper relative">
    <!-- Scroll Buttons -->
    {#if scrollPosition > 0}
      <button 
        class="carousel-button carousel-button-left" 
        on:click={scrollLeft}
        aria-label="Scroll Left"
      >
        <ChevronLeft/>
      </button>
    {/if}
    
    {#if carouselContainer && (scrollPosition + carouselContainer.clientWidth < carouselContainer.scrollWidth)}
      <button 
        class="carousel-button carousel-button-right" 
        on:click={scrollRight}
        aria-label="Scroll Right"
      >
        <ChevronRight/>
      </button>
    {/if}
    
    <div 
      bind:this={carouselContainer} 
      class="carousel-container"
      on:scroll={handleScroll}
    >
      {#each items as item (item.id)}
        <div class="carousel-item">
          <Card {item} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .carousel-wrapper {
    position: relative;
  }

  .carousel-container-wrapper {
    position: relative; /* Establishes positioning context for buttons */
  }

  .carousel-container {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    pointer-events: auto; /* Ensure carousel can be scrolled */
  }

  .carousel-item {
    flex: 0 0 auto;
    margin-right: 1rem;
    /* Optional: Adjust as needed */
    pointer-events: auto; /* Ensure items can be interacted with if needed */
  }

  .carousel-button {
    position: absolute; /* Positioned relative to carousel-container-wrapper */
    border: none;
    cursor: pointer;
    z-index: 10;
    color: white;
    padding: 0 0.5rem; /* Horizontal padding for better click area */
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%; /* Match the height of carousel-container */
    width: 40px; /* Adjust as needed */
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    transition: background 0.3s ease;
    pointer-events: auto; /* Ensure buttons can receive pointer events */
  }

  .carousel-button-left {
    left: 0; /* Position the left button */
  }

  .carousel-button-right {
    right: 0; /* Position the right button */
  }

  .carousel-button:hover {
    background: rgba(20, 20, 20, 0.7); /* Darken on hover */
  }

  /* Optional: Hide scrollbar for better aesthetics */
  .carousel-container::-webkit-scrollbar {
    display: none;
  }
  .carousel-container {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
