<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Carousel from "$lib/components/Carousel.svelte";
  import {
    popularShows,
    topRatedShows,
    trendingShows,
    moviesWithGenre,
  } from "$lib/store/globalState";
  import type { Movie } from "$lib/types/tmdb";

  let popular: Movie[] = [];
  let trending: Movie[] = [];
  let topRated: Movie[] = [];
  let myList: Movie[] = [];
  let allMoviesgenre: {id:number,name:string,movies:Movie[]}  [] = [];

  // Reactive statements to subscribe to stores
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

      console.log(allMoviesgenre);
      
    });
  }
</script>

<div class=" text-white relative">
  <Header />
  <HeroSection />

  <!-- Conditionally render Carousel components when data is available -->
  {#if popular.length > 0 && trending.length > 0 && topRated.length > 0}
    <div
      class="absolute w-full top-[35vh] md:top-[65vh] lg:top-[85vh] pl-10 flex flex-col space-y-4"
    >
      <Carousel title="Popular Shows" items={popular} />
      <div>
        <Carousel title="Trending Shows" items={trending} />
        <Carousel title="Top-Rated Shows" items={topRated} />
        {#each allMoviesgenre as MovieList}
          <Carousel title={MovieList.name} items={MovieList.movies} />
        {/each}
      </div>
    </div>
  {:else}
    <!-- Loading state -->
    <div class="ml-10 flex flex-col">
      <p>Loading...</p>
    </div>
  {/if}

  <!-- PopupCard positioned fixed and above all content -->
</div>


