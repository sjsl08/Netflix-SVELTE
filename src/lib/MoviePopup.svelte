<script>
    export let selectedMovie;
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    function closePopup() {
      dispatch('close');
    }
  </script>
  
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-4 max-w-sm w-full">
      <button class="absolute top-2 right-2 text-gray-500" on:click={closePopup}>
        &times;
      </button>
      <img
        src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
        alt={selectedMovie.title}
        class="w-full h-auto rounded-lg"
      />
      <h2 class="text-xl font-bold mt-2">{selectedMovie.title}</h2>
      <p class="mt-2">{selectedMovie.overview}</p>
      <p class="mt-2"><strong>Release Date:</strong> {selectedMovie.release_date}</p>
      <p class="mt-2"><strong>Rating:</strong> {selectedMovie.vote_average}</p>
    </div>
  </div>
  