<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { ChevronRight, Play, Plus, ThumbsUp } from "lucide-svelte";
    import { cardState } from '$lib/store/globalState';

    // Coordinates and dimensions
    export let x = 0;
    export let y = 0;
    export let dimensions = { width: 0, height: 0 };

    // Hover states
    export let isHovered = false;
    let isPopoverHovered = false;

    // Determine if the popover should be visible
    $: showPopover = isHovered || isPopoverHovered;

    // Handlers for mouse events on the popover
    function handlePopoverMouseEnter() {
        isPopoverHovered = true;
    }

    function handlePopoverMouseLeave() {
        isPopoverHovered = false;
    }

    // Handle scroll event to hide the popup
    function handleScroll() {
        isHovered = false;
        isPopoverHovered = false;
    }

    onMount(() => {
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component is destroyed
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<!-- PopupCard Container -->
<div 
    class="popup-card z-50 flex flex-col w-[300px] transition-all duration-300 {showPopover ? 'popup-scale-up opacity-100' : 'popup-scale-down opacity-0'}"
    style="
      position: fixed; 
      top: {y}px; 
      left: {x}px; 
      width: 300px; 
      height: 300px;
      z-index: 1000;
    "
    on:mouseenter={handlePopoverMouseEnter}
    on:mouseleave={handlePopoverMouseLeave}
>
    <img
        src="https://image.tmdb.org/t/p/w300/{$cardState.item?.poster_path}"
        alt=""
    />
    <div class="flex justify-between bg-gray-700">
        <div class="flex space-x-1">
            <Play class="rounded-full border-2 h-12 w-12 p-3" />
            <Plus  class="rounded-full border-2 h-12 w-12 p-3" />
            <ThumbsUp class="rounded-full border-2 h-12 w-12 p-3" />
        </div>
        <div>
            <ChevronRight class="rounded-full border-2 h-12 w-12 p-3" />
        </div>
    </div>
</div>

<style>
    /* Base Styles for PopupCard */
    .popup-card {
        background: rgba(0, 0, 0, 0.85);
        color: white;
        border-radius: 8px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        transform-origin: center;
    }

    /* Transition Classes */
    .transition-all {
        transition: transform 0.3s ease 0.1s, opacity 0.3s ease;
    }

    /* Scale Down (Initial State) */
    .popup-scale-down {
        transform: translate(-50%, -100%) scale(0.1);
        opacity: 0;
    }

    /* Scale Up (Hovered State) */
    .popup-scale-up {
        transform: translate(-50%, -100%) scale(1);
        opacity: 1;
    }

    /* Opacity Classes */
    .opacity-0 {
        opacity: 0;
    }

    .opacity-100 {
        opacity: 1;
    }
</style>
