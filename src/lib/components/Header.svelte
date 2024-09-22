<script>
    import { onMount } from "svelte";
    import { ChevronRight } from "lucide-svelte";
    import { page } from '$app/stores'; // Import the page store to get the current route
    import { cardView } from "$lib/store/globalState";

    let isSticky = false;
    let darkSubHead = false;
    let isTvShowsRoute = false;

    // Function to handle scroll and add sticky class
    const handleScroll = () => {
        isSticky = window.scrollY > 50;
        darkSubHead = window.scrollY > 25;
    };

    // Reactive statement to check if the current route is `/tvShows`
    $: isTvShowsRoute = $page.url.pathname === '/tvShows';

    // Adding the scroll event listener
    onMount(() => {
        window.addEventListener("scroll", handleScroll);

        // Clean up event listener when the component is destroyed
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });


    function toggleCard() {
        cardView.update(current => !current); 

    }
</script>

<header class={`flex flex-col px-10 transition-all duration-300 ease-in-out fixed top-0 left-0 right-0 z-50 ${isSticky ? 'bg-black shadow-lg' : 'bg-transparent'}`}>
    <div class="flex justify-between">
        <div class="flex gap-x-8 items-center">
            <img src="https://cdn.prod.website-files.com/5ee732bebd9839b494ff27cd/5ee732bebd98393d75ff281d_580b57fcd9996e24bc43c529.png" alt="Netflix" class="w-28 text-red-600" />
            <nav class="hidden text-sm md:flex space-x-4">
                <a href="/" class="hover:text-gray-300">Home</a>
                <a href="/tvShows" class="hover:text-gray-300">TV Shows</a>
                <a href="#" class="hover:text-gray-300">Movies</a>
                <a href="#" class="hover:text-gray-300">New & Popular</a>
                <a href="#" class="hover:text-gray-300">My List</a>
                <a href="#" class="hover:text-gray-300">Browse by Languages</a>
            </nav>
        </div>
        <div class="flex items-center space-x-8">
            <button class="hover:text-gray-300">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </button>
            <button class="hover:text-gray-300">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
            </button>
            <img src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg" alt="User" class="w-8 h-8 rounded" />
            <ChevronRight class="h-4 w-4" />
        </div>
    </div>

    {#if isTvShowsRoute}
        <div class={`h-16 px-3 flex justify-between w-full `}>
            <div class="flex items-center">
                <h1 class={`mr-4 text-4xl font-bold text-white`}>TV Shows</h1>
                <select name="" id="" class={`border border-white bg-black w-[150px] text-white  px-2 py-1`}>
                    <option value="abc">Genres</option>
                    <option value="abc">abc</option>
                    <option value="abc">abc</option>
                    <option value="abc">abc</option>
                </select>
            </div>
            <div class="flex items-center">
                <button class="  h-10 w-14 flex items-center justify-center border-r-0 "><svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="24" height="24" data-icon="ListStandard" aria-hidden="true" class="svg-icon svg-icon-rows"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 6H0V4H24V6ZM24 18V20H0V18H24ZM0 13H12V11H0V13Z" fill="currentColor"></path></svg></button>
                <button on:click={toggleCard} class="  h-10 w-14 flex items-center justify-center "><svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="24" height="24" data-icon="GridFillStandard" aria-hidden="true" class="svg-icon svg-icon-grid"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 3C0.447715 3 0 3.44772 0 4V10C0 10.5523 0.447715 11 1 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3H1ZM1 13C0.447715 13 0 13.4477 0 14V20C0 20.5523 0.447715 21 1 21H10C10.5523 21 11 20.5523 11 20V14C11 13.4477 10.5523 13 10 13H1ZM13 4C13 3.44772 13.4477 3 14 3H23C23.5523 3 24 3.44772 24 4V10C24 10.5523 23.5523 11 23 11H14C13.4477 11 13 10.5523 13 10V4ZM14 13C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21H23C23.5523 21 24 20.5523 24 20V14C24 13.4477 23.5523 13 23 13H14Z" fill="currentColor"></path></svg></button>
            </div>
        </div>
    {/if}
</header>
