<!-- src/routes/search/+page.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { searchMovies } from '$lib/api/tmdb';
    import { derived } from 'svelte/store';
  import Carousel from '$lib/components/Carousel.svelte';
  import Card from '$lib/components/Card.svelte';

    // State variables
    let searchQuery: string = '';
    let searchResults = [];
    let isLoading: boolean = false;
    let error: string | null = null;
    let currentPage: number = 1;
    let totalPages: number = 1;

    // Get the search query from the URL
    const queryStore = derived(page, ($page) => {
        return $page.url.searchParams.get('query') || '';
    });

    const unsubscribe = queryStore.subscribe((value) => {
        searchQuery = value;
        if (searchQuery.trim() !== '') {
            performSearch(searchQuery, 1);
        } else {
            // Reset state if query is empty
            searchResults = [];
            isLoading = false;
            error = null;
            currentPage = 1;
            totalPages = 1;
        }
    });

    onDestroy(() => {
        unsubscribe();
    });

    // Function to perform the search
    async function performSearch(query: string, page: number) {
        isLoading = true;
        error = null;

        try {
            const res = await searchMovies(query, page);
            console.log(res);
            
            searchResults = res;
        } catch (err) {
            console.error('Error fetching search results:', err);
            error = 'Failed to fetch search results.';
        } finally {
            isLoading = false;
        }
    }

    // Pagination handlers
    async function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        // Update the URL with the new page parameter
        window.history.pushState({}, '', `/search?query=${encodeURIComponent(searchQuery)}&page=${page}`);
        performSearch(searchQuery, page);
    }
</script>

<style>
    /* Styles for the search results */


    .error-message {
        color: red;
    }

  
</style>

<div class="absolute top-36 w-screen">
    {#if isLoading}
        <p>Loading...</p>
    {:else if error}
        <p class="error-message">{error}</p>
    {:else if searchQuery === ''}
        <p>Please enter a search query.</p>
    {:else if searchResults.length === 0}
        <p>No results found for "{searchQuery}".</p>
    {:else}

        <div class="absolute  flex flex-wrap  left-12 flex gap-4">

            {#each searchResults as item}
    <Card {item}/>                
            {/each}
        </div>  
        
    {/if}
</div>
