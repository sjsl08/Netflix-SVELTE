<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import Carousel from "$lib/components/Carousel.svelte";
  import Header from "$lib/components/Header.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import {
    cardView,
    moviesWithGenre,
    myFav,
    popularShows,
    topRatedShows,
    trendingShows,
  } from "$lib/store/globalState";
  import type { Show } from "$lib/tmdbStore";

  let popular: Show[] = [];
  let trending: Show[] = [];
  let topRated: Show[] = [];
  let myList: Show[] = [];
  let allMoviesgenre: any[] = [];

  $: isCardView = $cardView;
  $: {
    popularShows.subscribe((value) => {
      popular = value;
    });
    trendingShows.subscribe((value) => {
      trending = value;
    });
    topRatedShows.subscribe((value) => {
      topRated = value;
    });
    moviesWithGenre.subscribe((value) => {
      allMoviesgenre = value;
    });
    myFav.subscribe((value) => {
      myList = value;
    });
  }
</script>

<div class=" text-white min-h-screen">
  <Header />
  {#if !isCardView}
    <HeroSection />
  {/if}

  <div class={`ml-10 flex flex-col gap-9 ${isCardView ? "pt-32" : "mt-0"}`}>
    {#if popular.length > 0 && trending.length > 0 && topRated.length > 0}
      <div class="pl-10 flex flex-col space-y-4 mt-10">
        <Carousel title="Popular Shows" items={popular} />
        <Carousel title="Trending Shows" items={trending} />
        <Carousel title="Top-Rated Shows" items={topRated} />
        {#each allMoviesgenre as MovieList}
          <Carousel title={MovieList.name} items={MovieList.movies} />
        {/each}
      </div>
    {:else}
      <!-- Loading state -->
      <div class="ml-10 flex flex-col">
        <p>Loading...</p>
      </div>
    {/if}
  </div>
</div>
