<script lang="ts">
  import Card from "./Card.svelte";

  // Define props with types
  export let title: string = "";
  export let items: { id: number; title: string; poster_path: string }[] = [];
  export let scrollAmount: number = 320;

  let carouselContainer: HTMLDivElement | null = null;
  let scrollPosition: number = 0;

  // Function to scroll left
  function scrollLeft() {
    if (carouselContainer) {
      scrollPosition = Math.max(0, scrollPosition - scrollAmount);
      carouselContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }

  // Function to scroll right
  function scrollRight() {
    if (carouselContainer) {
      scrollPosition += scrollAmount;
      carouselContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }
</script>

<div class="bg-[#141414] relative carousel-wrapper  ">
  <h1 class="mt-4 mb-1 text-2xl font-semibold">{title}</h1>
  
  <!-- Scroll Buttons -->
  <!-- <button 
    class="carousel-button carousel-button-left" 
    on:click={scrollLeft}
    aria-label="Scroll Left"
  >
    &#9664;
  </button>
  
  <button 
    class="carousel-button carousel-button-right" 
    on:click={scrollRight}
    aria-label="Scroll Right"
  >
    &#9654;
  </button>
   -->
  <div bind:this={carouselContainer} class="carousel-container">
    {#each items as item (item.id)}
      <div class="carousel-item  ">
        <Card {item} />
      </div>
    {/each}
  </div>
</div>

<style>
  .carousel-wrapper {
    position: relative;
  }

  .carousel-title {
    margin-bottom: 1rem;
  }

  .carousel-container {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
  }

  .carousel-item {
    flex: 0 0 auto;
    margin-right: 1rem;
  }

  .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.5);
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 10;
  }

  .carousel-button-left {
    left: 10px;
  }

  .carousel-button-right {
    right: 10px;
  }

  .carousel-button:hover {
    background: rgba(255, 255, 255, 0.8);
  }
</style>
