<!-- src/lib/components/GenreDropdown.svelte -->
<script>
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';

    // Props passed to the component
    export let genres = [];
    export let selectedGenre = null;

    const dispatch = createEventDispatcher();
    let isOpen = false;          // Tracks if the dropdown is open
    let dropdownRef;             // Reference to the dropdown element

    // Toggle the dropdown open/closed
    function toggleDropdown() {
        isOpen = !isOpen;
    }

    // Select a genre and close the dropdown
    function selectGenre(genre) {
        selectedGenre = genre;
        dispatch('select', genre); // Dispatch a 'select' event with the selected genre
        isOpen = false;
    }

    // Close dropdown if click is outside
    function handleClickOutside(event) {
        if (dropdownRef && !dropdownRef.contains(event.target)) {
            isOpen = false;
        }
    }

    // Add event listener for clicks outside on mount
    onMount(() => {
        if (typeof document !== 'undefined') { // Ensure document is available
            document.addEventListener('click', handleClickOutside);
        }
    });

    // Clean up the event listener on destroy
    onDestroy(() => {
        if (typeof document !== 'undefined') { // Ensure document is available
            document.removeEventListener('click', handleClickOutside);
        }
    });
</script>

<style>
    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-button {
        color: white;
        padding: 8px 12px;
        border: 1px solid white;
        cursor: pointer;
        min-width: 150px;
        text-align: left;
        background-color: #000; /* Background color for visibility */
        border-radius: 4px;
    }

    .dropdown-button:focus {
        outline: none;
        box-shadow: 0 0 0 2px #fff; /* Optional focus styling */
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #000;
        color: white;
        border: 1px solid white;
        margin-top: 4px;
        padding: 10px;
        display: none;
        z-index: 1000;
        width: 400px; /* Adjusted width for better appearance */
        border-radius: 4px;
    }

    .dropdown-menu.open {
        display: block;
    }

    .genres-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* Restored to three columns */
        column-gap: 0.5rem;
        row-gap: 8px; /* Optional: Adds space between rows */
    }

    .genre-item {
        font-size: 14px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 2px;
        transition: background-color 0.2s;
    }

    .genre-item:hover {
        background-color: #333;
    }

    .selected {
        font-weight: bold;
        background-color: #555;
    }
</style>

<div class="dropdown" bind:this={dropdownRef}>
    <button
        class="dropdown-button"
        on:click={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
    >
        {#if selectedGenre}
            {selectedGenre.name}
        {:else}
            Select Genre
        {/if}
    </button>
    <div
        class={`dropdown-menu ${isOpen ? 'open' : ''}`}
        role="listbox"
        aria-activedescendant={selectedGenre ? `genre-${selectedGenre.id}` : null}
    >
        {#if genres.length > 0}
            <div class="genres-grid">
                {#each genres as genre}
                    <div
                        id={`genre-${genre.id}`}
                        class={`genre-item ${selectedGenre && selectedGenre.id === genre.id ? 'selected' : ''}`}
                        on:click={() => selectGenre(genre)}
                        role="option"
                        aria-selected={selectedGenre && selectedGenre.id === genre.id}
                    >
                        {genre.name}
                    </div>
                {/each}
            </div>
        {:else}
            <div>No genres available.</div>
        {/if}
    </div>
</div>
