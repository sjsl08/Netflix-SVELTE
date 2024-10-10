<script lang="ts">
    import { page } from '$app/stores';
    import { getMovieTrailer } from '$lib/api/tmdb';
    import Player from '$lib/components/Player.svelte';

    // Automatically subscribe to the 'page' store
    // and extract the 'id' parameter
    let videoId: string;
    $: videoId = $page.params.id;

    let trailer = "";

    // Use a reactive statement with an async function
    $: if (videoId) {
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
        <p>Loading video...</p>
    {/if}
</div>
