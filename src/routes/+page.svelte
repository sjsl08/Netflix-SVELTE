<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Carousel from "$lib/components/Carousel.svelte";
  import { addItem, popularShows, topRatedShows, trendingShows, myFav, moviesWithGenre, cardState } from "$lib/store/globalState";
  import type { Show } from "$lib/types/tmdb";
  import PopupCard from "$lib/components/PopupCard.svelte";

  let popular: Show[] = [];
  let trending: Show[] = [];
  let topRated: Show[] = [];
  let myList: Show[] = [];
  let allMoviesgenre: any[] = [];

  // Reactive statements to subscribe to stores
  $: {
    popularShows.subscribe(value => { popular = value });
    trendingShows.subscribe(value => { trending = value });
    topRatedShows.subscribe(value => { topRated = value });
    moviesWithGenre.subscribe(value => { 
      allMoviesgenre = value;
    });
    myFav.subscribe(value => { myList = value });
  }
</script>

<div class=" text-white min-h-screen relative">
  <Header />
  <HeroSection />

  <!-- Conditionally render Carousel components when data is available -->
  {#if popular.length > 0 && trending.length > 0 && topRated.length > 0}
    <div class="pl-10 flex flex-col space-y-4 mt-10">
      <Carousel title="Popular Shows" items={popular} />
      <Carousel title="Trending Shows" items={trending} />
      <Carousel title="Top-Rated Shows" items={topRated} />
      {#each allMoviesgenre as MovieList}
        <Carousel title={MovieList.name} items={MovieList.movies.slice(0,5)} />
      {/each}
    </div>
  {:else}
    <!-- Loading state -->
    <div class="ml-10 flex flex-col">
      <p>Loading...</p>
    </div>
  {/if}

  <!-- PopupCard positioned fixed and above all content -->

</div>

<style>
  /* Additional page-specific styles */
  .min-h-screen {
    min-height: 100vh;
  }
</style>
