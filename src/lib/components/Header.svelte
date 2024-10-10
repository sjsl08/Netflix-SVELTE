<!-- src/components/Header.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { ChevronRight,Bell,Search } from "lucide-svelte";
    import { page } from '$app/stores'; // Import the page store to get the current route
    import { cardView, tvGenres } from "$lib/store/globalState";
    import GenreDropdown from '$lib/components/GenreDropdown.svelte'; // Adjust the path as needed
    import { searchMovies } from '$lib/api/tmdb'; // Import the searchMovies function
    import { goto } from '$app/navigation'; // Import goto for navigation

    let isSticky = false;
    let darkSubHead = false;
    let isTvShowsRoute = false;
    let selectedGenre = null;

    // Search bar state
    let isSearchActive = false;
    let searchInputRef: HTMLInputElement | null = null;
    let searchQuery: string = '';

    // Function to handle scroll and add sticky class
    const handleScroll = () => {
        isSticky = window.scrollY > 50;
        darkSubHead = window.scrollY > 25;
    };

    // Reactive statement to check if the current route is `/tvShows`
    $: whiteHeader = $page.url.pathname != '/';
    
    // Reactive assignment to get all TV genres
    $: allTvGenres = $tvGenres;

    // Adding the scroll and click event listeners on mount
    onMount(() => {
        window.addEventListener("scroll", handleScroll);
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        // Clean up event listeners when the component is destroyed
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    // Toggle the card view state
    function toggleCard() {
        cardView.update(current => !current); 
    }

    // Handle genre selection
    function handleGenreSelect(event) {
        selectedGenre = event.detail;
        // Add your logic here to handle the selected genre,
        // such as filtering TV shows based on the selected genre.
        console.log('Selected Genre:', selectedGenre);
    }

    // Toggle search bar active state
    function toggleSearch(event: Event) {
        event.stopPropagation(); // Prevent the click from bubbling up to the document
        isSearchActive = !isSearchActive;

        if (isSearchActive) {
            // Focus the input field when search is active
            setTimeout(() => {
                if (searchInputRef) {
                    searchInputRef.focus();
                }
            }, 100); // Slight delay to ensure the input is rendered
        }
    }

    // Close search bar if clicking outside
    function handleClickOutside(event: Event) {
        if (isSearchActive) {
            const searchBar = document.getElementById('search-bar');
            if (searchBar && !searchBar.contains(event.target as Node)) {
                isSearchActive = false;
            }
        }
    }

    // Handle 'Escape' key to close the search bar
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && isSearchActive) {
            isSearchActive = false;
        }
    }

    // Handle the search when Enter key is pressed
    async function handleSearch(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if inside a form
            const query = searchQuery.trim();
            if (query === '') {
                // Optionally, you can show a message to the user
                return;
            }

            // Option 1: Navigate to a Search Results Page with Query Parameter
            // This approach is recommended for better UX and SEO.
            // It allows users to share URLs with search queries.
            await goto(`/search?query=${encodeURIComponent(query)}`);

            // Option 2: Fetch and Display Results Inline (e.g., Dropdown or Modal)
            // Uncomment the following code if you prefer inline display.

            /*
            const results = await searchMovies(fetch, query);
            // Handle the results, e.g., update a store or show a dropdown.
            console.log('Search Results:', results);
            // You might want to navigate or display the results as per your app's design.
            */
        }
    }
</script>

<style>
    /* Header Styles */
    header {
        /* You can add additional styles here if needed */
    }

    /* Search Bar Styles */
    .search-container {
        position: relative;
        display: flex;
        align-items: center;
        transition: width 0.3s ease-in-out, background-color 0.3s ease-in-out;
        overflow: hidden;
        width: 40px; /* Initial width to fit only the icon */
    }

    .search-container.active {
        width: 200px; /* Expanded width */
        background-color: #374151; /* Slightly lighter background when active */
    }

    .search-input {
        flex: 1;
        padding: 0.5rem;
        background: transparent;
        border: none;
        color: white;
        outline: none;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    .search-container.active .search-input {
        opacity: 1;
    }

    .search-button {
        padding: 0.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    /* Optional: Add hover effects */
    .search-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    /* Search Dropdown Styles (if using inline display) */
    .search-dropdown {
        /* Adjust positioning as needed */
        top: 100%;
        left: 0;
    }
</style>


  <header class={`flex flex-col px-10 ${isSticky ? 'bg-black shadow-lg' : 'bg-transparent'} transition-all ${whiteHeader? 'bg-gradient-to-b from-[#ffffff] to-transparent ' : ''}  duration-300 ease-in-out fixed top-0 left-0 right-0 z-50 `}>
    <div class="flex justify-between py-4">
        <div class="flex gap-x-8 items-center">
            <a href="/">
                <img src="https://cdn.prod.website-files.com/5ee732bebd9839b494ff27cd/5ee732bebd98393d75ff281d_580b57fcd9996e24bc43c529.png" alt="Netflix" class="w-28 text-red-600" />
            </a>
            <nav class="hidden text-sm md:flex space-x-4">
                <!-- <a href="/" class="hover:text-gray-300">Home</a> -->
                <!-- <a href="/tvShows" class="hover:text-gray-300">TV Shows</a>
                <a href="#" class="hover:text-gray-300">Movies</a>
                <a href="#" class="hover:text-gray-300">New & Popular</a> -->
                <a href="myList" class="text-lg">My List</a>
                <!-- <a href="#" class="hover:text-gray-300">Browse by Languages</a> -->
            </nav>
        </div>
        <div class="flex items-center space-x-8">
            <!-- Search Bar -->
            <div
                id="search-bar"
                class={`search-container ${isSearchActive ? 'active' : 'inactive'}`}
                on:click={toggleSearch}
            >
                <button class="search-button" aria-label="Toggle Search">
                    <!-- Search Icon -->
                   <Search color={whiteHeader ? 'black' : 'white'}/>
                </button>
                <input
                    bind:this={searchInputRef}
                    bind:value={searchQuery}
                    class="search-input"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    on:keydown={handleSearch}
                />
            </div>
            <!-- Other Icons -->
               <Bell color={whiteHeader ? 'black' : 'white'}/>
            <img src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg" alt="User" class="w-8 h-8 rounded" />
            <ChevronRight color={whiteHeader ? 'black' : 'white'} />
        </div>
    </div>

    {#if isTvShowsRoute}
        <div class="h-16 px-3 flex justify-between w-full items-center">
            <div class="flex items-center">
                <h1 class="mr-4 text-4xl font-bold text-white">TV Shows</h1>
                <!-- Replace the <select> with the custom GenreDropdown component -->
                <GenreDropdown
                    genres={allTvGenres}
                    selectedGenre={selectedGenre}
                    on:select={handleGenreSelect}
                />
            </div>
            <div class="flex items-center space-x-2">
                <button class="h-10 w-14 flex items-center justify-center border border-gray-700 rounded hover:bg-gray-700" aria-label="List View">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24"
                        width="24" height="24" data-icon="ListStandard" aria-hidden="true"
                        class="svg-icon svg-icon-rows">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M24 6H0V4H24V6ZM24 18V20H0V18H24ZM0 13H12V11H0V13Z"
                            fill="currentColor"></path>
                    </svg>
                </button>
                <button on:click={toggleCard} class="h-10 w-14 flex items-center justify-center border border-gray-700 rounded hover:bg-gray-700" aria-label="Grid View">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24"
                        width="24" height="24" data-icon="GridFillStandard" aria-hidden="true"
                        class="svg-icon svg-icon-grid">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M1 3C0.447715 3 0 3.44772 0 4V10C0 10.5523 0.447715 11 1 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3H1ZM1 13C0.447715 13 0 13.4477 0 14V20C0 20.5523 0.447715 21 1 21H10C10.5523 21 11 20.5523 11 20V14C11 13.4477 10.5523 13 10 13H1ZM13 4C13 3.44772 13.4477 3 14 3H23C23.5523 3 24 3.44772 24 4V10C24 10.5523 23.5523 11 23 11H14C13.4477 11 13 10.5523 13 10V4ZM14 13C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21H23C23.5523 21 24 20.5523 24 20V14C24 13.4477 23.5523 13 23 13H14Z"
                            fill="currentColor"></path>
                    </svg>
                </button>
            </div>
        </div>
    {/if}
</header>
