<script lang="ts">
  import { goto } from "$app/navigation";
  import { closeModal } from "$lib/store/globalState";
  import type { Movie } from "$lib/utils/helpers";
  import { addToList } from "$lib/utils/helpers";
  import { Check, Plus, Play } from "lucide-svelte";

  export let id = "";
  export let title = "Airport 1975";
  export let match = "67% Match";
  export let rating = "5+";
  export let year = 1974;
  export let description =
    "When an in-flight collision incapacitates the pilots of an airplane bound for Los Angeles,...";
  export let duration = "22m";
  export let imageUrl = "path/to/your/image.jpg";
  let added = false;

  const handleAddToList=()=> {
    let data : Movie= {
      id,
      poster_path: imageUrl,
      title,
      image: `https://image.tmdb.org/t/p/w500${imageUrl}`,
    };

    addToList(data);
    added = !added;
  }
</script>

<div class="bg-[#181818] text-white rounded-lg shadow-md w-64">
  <div class="relative">
    <img
      src={imageUrl}
      alt={title}
      class="rounded-t-lg w-full h-40 object-cover"
    />
    <div
      class="absolute top-2 right-2 bg-[#000000b3] text-white px-2 py-0.5 rounded-md text-xs font-semibold"
    >
      {duration}
    </div>
    <div
      class="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent"
    ></div>

    <h3 class="absolute bottom-0 left-2 font-semibold text-base mb-1.5">
      {title}
    </h3>
  </div>
  <div class="p-3">
    <div class="flex flex-col text-sm mb-1">
      <div class=" flex justify-between">
        <div class="flex flex-col justify-between items-center">
          <div class="text-[#46d369]">
            <span>{match}</span>
          </div>
          <div class="text-[#b3b3b3]">
            <span class="border border-[#b3b3b3] px-1 mr-2">{rating}</span>
            <span>{year}</span>
          </div>
        </div>
        <div>
          <button
            on:click={() => {
              goto(`/watch/${id}`);
              closeModal();
            }}
            class="rounded-full transition-colors duration-200 p-3 border-2 border-gray-700 hover:border-white"
          >
            <Play class="text-white h-6 w-6" />
          </button>
          <button
            on:click={handleAddToList}
            class="rounded-full transition-colors duration-200 p-3 border-2 border-gray-700 hover:border-white"
          >
            {#if added}
              <Check class=" h-6 w-6" />
            {:else}
              <Plus class="h-6 w-6" />
            {/if}
          </button>
        </div>
      </div>
    </div>

    <p class="text-xs text-[#b3b3b3] mb-3 leading-tight">{description}</p>
  </div>
</div>

<style>
  /* Add any additional styles if needed */
</style>
