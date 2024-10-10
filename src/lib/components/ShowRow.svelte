<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { fetchShows } from "$lib/tmdbStore";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import "@splidejs/splide/dist/css/splide.min.css"; // Import Splide CSS

  let upcomingMovies = [];
  let selectedMovie = null; // Track the selected movie for the modal
  let modalPosition = { top: 0, left: 0 }; // Track the position of the modal
  let options = {
    type: 'loop',
    perPage: 8,
    focus: -4,
    pagination: false,
    arrows: true,
    gap: '1rem',
  };

  onMount(async () => {
    try {
      upcomingMovies = await fetchShows(); // Fetch upcoming movies
    } catch (error) {
      console.error("Error fetching shows:", error);
    }
  });

  // Function to show the modal with the selected movie and set its position
  function showModal(movie, event) {
    selectedMovie = movie;
    const card = event.currentTarget; // Get the clicked card element
    const rect = card.getBoundingClientRect(); // Get the card's position
    modalPosition = { top: rect.top + window.scrollY, left: rect.left + window.scrollX }; // Adjust for scrolling
  }

  // Function to close the modal
  function closeModal() {
    selectedMovie = null;
  }
</script>

{#if browser && upcomingMovies}
  <h1>Upcoming Movies</h1>
  <div class="w-full flex justify-center bg-black text-white gap-8 relative overflow-visible">
    <Splide options={options}>
      {#each upcomingMovies as movie}
        <SplideSlide>
          <div
            class="relative w-full h-auto cursor-pointer group overflow-visible transform transition-transform duration-300 hover:scale-105"
            on:click={(event) => showModal(movie, event)}  
          >
            <img
              src={"https://image.tmdb.org/t/p/w780" + movie.poster_path}
              alt="poster"
              class="w-full h-auto rounded-lg shadow-lg"
            />
          
          </div>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
{/if}

<!-- Modal -->
{#if selectedMovie}
  <div
    class="modal absolute bg-white text-black p-4 rounded-lg shadow-lg"
    style={`top: ${modalPosition.top -100}px; left: ${modalPosition.left - 100}px; z-index: 50;`} 
    on:click|stopPropagation
  >
    <button class="close absolute top-2 right-2 text-gray-600" on:click={closeModal}>✖</button>
    <img
      src={"https://image.tmdb.org/t/p/w780" + selectedMovie.poster_path}
      alt={selectedMovie.title}
      class="w-full rounded-lg mb-4"
    />
    <h2 class="text-xl font-bold">{selectedMovie.title}</h2>
    <p class="mt-2">Detailed information about the movie can go here.</p>
  </div>
{/if}

<style>
  .splide__arrow {
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    width: 40px;
    height: 40px;
  }

  .splide__arrow--prev {
    left: 10px;
  }

  .splide__arrow--next {
    right: 10px;
  }

  .splide__arrow svg {
    fill: white;
  }

  .splide__pagination {
    display: none;
  }

  .additional-info {
    z-index: 10;
    padding: 1rem;
    overflow: visible;
    transition: opacity 0.3s, transform 0.3s;
    transform: translateY(100%);
  }

  .group:hover .additional-info {
    opacity: 1;
    transform: translateY(0);
  }

  .modal {
    position: absolute;
    max-width: 300px;
    z-index: 50;
    transition: transform 0.3s ease-in-out;
  }

  .close {
    cursor: pointer;
    font-size: 1.5rem;
    color: #333;
  }
</style>
