<!-- src/components/Header.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { ChevronRight, Bell, Search, Menu, X } from "lucide-svelte";
  import { page } from "$app/stores";
  import { cardView } from "$lib/store/globalState";
  import { goto } from "$app/navigation";

  let isSticky: boolean = false;
  let darkSubHead: boolean = false;

  // Search bar state
  let selectedGenre: boolean = null;
  let isSearchActive = false;
  let searchInputRef: HTMLInputElement | null = null;
  let searchQuery: string = "";

  // Hamburger menu state
  let isMenuOpen: boolean = false;

  // Reactive statement to determine if the header should be white
  $: whiteHeader = $page.url.pathname !== "/";

  // Function to handle scroll and add sticky class
  const handleScroll = () => {
    isSticky = window.scrollY > 50;
    darkSubHead = window.scrollY > 25;
  };

  // Adding the scroll and click event listeners on mount
  onMount(() => {
    window.addEventListener("scroll", handleScroll);
    // document.addEventListener('click', handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listeners when the component is destroyed
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // document.removeEventListener('click', handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  // Toggle search bar active state
  const toggleSearch = (event: Event) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the document
    isSearchActive = !isSearchActive;
    console.log("Search Toggled:", isSearchActive); // Debugging log

    if (isSearchActive) {
      // Focus the input field when search is active
      setTimeout(() => {
        if (searchInputRef) {
          searchInputRef.focus();
        }
      }, 100); // Slight delay to ensure the input is rendered
    } else {
      searchQuery = ""; // Clear search query when deactivated
    }
  };

  // Handle 'Escape' key to close the search bar and mobile menu
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      if (isSearchActive) {
        isSearchActive = false;
        searchQuery = "";
        console.log("Search Closed by Escape");
      }
      if (isMenuOpen) {
        isMenuOpen = false;
        console.log("Menu Closed by Escape");
      }
    }
  };

  // Handle the search when Enter key is pressed
  const handleSearch = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if inside a form
      const query = searchQuery.trim();
      if (query === "") {
        // Optionally, you can show a message to the user
        return;
      }

      // Navigate to the Search Results Page with Query Parameter
      await goto(`/search?query=${encodeURIComponent(query)}`);

      // Reset search state
      isSearchActive = false;
      searchQuery = "";
      console.log("Search Executed:", query);
    }
  };

  // Toggle Hamburger Menu
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    console.log("Menu Toggled:", isMenuOpen); // Debugging log
  };

  // Close menu when a link is clicked (for better UX)
  const closeMenu = () => {
    isMenuOpen = false;
    console.log("Menu Closed"); // Debugging log
  };
</script>

<header
  class={`fixed top-0 left-0 right-0 z-50 flex flex-col px-5 md:px-10 transition-all duration-300 ease-in-out ${isSticky ? "bg-black shadow-lg" : whiteHeader ? "text-white" : "bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-transparent"}`}
>
  <!-- Main Header Content -->
  <div class="flex justify-between items-center">
    <div class="flex gap-x-6 md:gap-x-8 items-center">
      <a href="/">
        <img
          src="https://cdn.prod.website-files.com/5ee732bebd9839b494ff27cd/5ee732bebd98393d75ff281d_580b57fcd9996e24bc43c529.png"
          alt="Netflix"
          class="w-28"
        />
      </a>
      <!-- Desktop Navigation -->
      <nav class="hidden text-sm md:flex space-x-4">
        <a href="/" class="hover:text-gray-300">Home</a>
        <a class="hover:text-gray-300">TV Shows</a>
        <a class="hover:text-gray-300">Movies</a>
        <a class="hover:text-gray-300">New & Popular</a>
        <a href="/myList" class="hover:text-gray-300">My List</a>
        <a class="hover:text-gray-300">Browse by Languages</a>
      </nav>
    </div>
    <div class="flex items-center space-x-4">
      <!-- Search Bar -->
      <div
        id="search-bar"
        class={`search-container ${isSearchActive ? "active" : "inactive"}`}
        on:click|stopPropagation={toggleSearch}
      >
        <button
          class="search-button"
          aria-label="Toggle Search"
          on:click|stopPropagation={toggleSearch}
        >
          <!-- Search Icon -->
          <Search size={20} color="white" />
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
      <Bell size={20} color="white" />
      <img
        src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
        alt="User"
        class="w-8 h-8 rounded cursor-pointer"
      />
      <ChevronRight size={20} color="white" />
      <!-- Hamburger Menu Button (Visible on Mobile) -->
      <button
        id="hamburger-button"
        class="md:hidden ml-4 focus:outline-none"
        on:click={toggleMenu}
        aria-label="Toggle Menu"
      >
        <Menu color="white" size={24} />
      </button>
    </div>
  </div>

  <!-- Mobile Navigation Menu -->
  <div
    id="mobile-menu"
    class={`mobile-menu relative ${isMenuOpen ? "open" : ""} lg:hidden`}
    on:click|stopPropagation
  >
    <button class="absolute right-4" on:click={toggleMenu}>
      <X color="white" size={24} />
    </button>

    <a href="/" on:click={closeMenu}>Home</a>
    <a href="/tvShows" on:click={closeMenu}>TV Shows</a>
    <a href="/movies" on:click={closeMenu}>Movies</a>
    <a href="/new-popular" on:click={closeMenu}>New & Popular</a>
    <a href="/myList" on:click={closeMenu}>My List</a>
    <a href="/languages" on:click={closeMenu}>Browse by Languages</a>
  </div>

  <!-- Overlay for Mobile Menu -->
  {#if isMenuOpen}
    <div class="overlay show" on:click={closeMenu}></div>
  {/if}
</header>

<style>


  /* Search Bar Styles */
  .search-container {
    position: relative;
    display: flex;
    align-items: center;
    transition:
      width 0.3s ease-in-out,
      background-color 0.3s ease-in-out;
    overflow: hidden;
    width: 40px; /* Initial width to fit only the icon */
  }

  .search-container.active {
    width: 200px; /* Expanded width */
    border: 1px solid white;
    background-color: #000000; /* Slightly lighter background when active */
  }

  .search-input {
    padding-left: 2rem;
    flex: 1;
    padding-block: 0.5rem;
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
    position: absolute;
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

  /* Mobile Menu Styles */
  .mobile-menu {
    position: fixed; /* Changed to fixed */
    top: 0; /* Adjust based on your header's actual height */
    left: 0;
    right: 0;
    background-color: #000; /* Solid black background for visibility */
    padding: 1rem 2rem;
    transition: transform 0.3s ease-in-out;
    transform: translateY(-100%);
    z-index: 60; /* Increased z-index to appear above the header */
  }

  .mobile-menu.open {
    transform: translateY(0);
  }

  .mobile-menu a {
    display: block;
    padding: 0.5rem 0;
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
  }

  .mobile-menu a:hover {
    color: #e50914; /* Netflix red for hover */
  }

  /* Overlay for Mobile Menu */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.3s ease-in-out,
      visibility 0.3s ease-in-out;
    z-index: 55; /* Between header (z-50) and mobile-menu (z-60) */
  }

  .overlay.show {
    opacity: 1;
    visibility: visible;
  }

  /* Responsive Adjustments */
  @media (min-width: 768px) {
    .mobile-menu,
    .overlay {
      display: none;
    }
  }
</style>
