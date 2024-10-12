<script lang="ts">
    import { page } from '$app/stores';
    import { getMovieTrailer } from '$lib/api/tmdb';
    import Player from '$lib/components/Player.svelte';
    import { cardState } from '$lib/store/globalState';

    // Automatically subscribe to the 'page' store
    // and extract the 'id' parameter
    let videoId: string;
    $: videoId = $page.params.id;

    let trailer = "";

    // Use a reactive statement with an async function
    $: if (videoId) {
        
  cardState.update((state) => ({
    ...state,
    isHovered: false,
    item:null,
    position:{x:-500,y:0}
  }));
        (async () => {
            try {
                trailer = await getMovieTrailer(videoId);
                console.log(trailer);
                
            } catch (error) {
                console.error('Failed to fetch trailer:', error);
            }
        })();
    }
</script>

<div >
    {#if trailer}
        <Player showControls={true} videoId={trailer.key} />
    {:else}
        <p class="absolute top-28 left-12 w-full text-white">No Playback video...</p>
    {/if}
</div>
