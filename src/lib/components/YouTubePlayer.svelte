<!-- src/lib/components/YouTubePlayer.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { v4 as uuidv4 } from 'uuid'; // Ensure you have installed uuid via `npm install uuid`

  /**
   * Props:
   * - url (string): Full YouTube video URL (required)
   * - width (number): Width of the player (optional, default: 560)
   * - height (number): Height of the player (optional, default: 315)
   */
  export let url = ''; // Full YouTube URL
  export let width = 560;
  export let height = 315;
  

  const isMuted = writable(true); // Initialize as muted
  const error = writable(null);
  let player;
  let playerId = `youtube-video-${uuidv4()}`; // Unique ID for the player container

  /**
   * Extracts the YouTube video ID from a given URL.
   * Supports various YouTube URL formats.
   * @param {string} url - The full YouTube video URL.
   * @returns {string|null} - The extracted video ID or null if not found.
   */
  function extractVideoID(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Function to load the YouTube Iframe API.
   * Ensures the script is loaded only once.
   * @returns {Promise<Object>} - Resolves with the YT object.
   */
  function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
      } else {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.onerror = () => reject(new Error("Failed to load YouTube Iframe API"));

        // Append the script to the head to ensure it loads correctly
        document.head.appendChild(tag);

        // YouTube API will call this function when it's ready
        window.onYouTubeIframeAPIReady = () => {
          resolve(window.YT);
        };
      }
    });
  }

  onMount(async () => {
    if (!url) {
      error.set("No YouTube URL provided.");
      return;
    }

    const videoId = extractVideoID(url);
    if (!videoId) {
      error.set("Invalid YouTube URL provided.");
      return;
    }

    try {
      const YT = await loadYouTubeAPI();

      player = new YT.Player(playerId, {
        videoId,
        // width: width.toString(),
        // height: height.toString(),
        playerVars: {
          enablejsapi: 1,
          autoplay: 1,          // Enable autoplay
          rel: 0,               // Disable related videos at the end
          mute: 1,              // Start muted
          controls: 0,          // Hide default controls
          modestbranding: 1,    // Minimal YouTube branding
          disablekb: 1,         // Disable keyboard controls
          fs: 0,                // Disable fullscreen button
          iv_load_policy: 3,    // Hide video annotations
          cc_load_policy: 0,    // Disable closed captions
          showinfo: 0           // Deprecated, but included for older API versions
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
    } catch (err) {
      console.error("Failed to load YouTube Iframe API:", err);
      error.set("Failed to load YouTube player.");
    }
  });

  function onPlayerReady(event) {
    console.log("YouTube Player is ready");
    // Ensure the player is muted and autoplayed
    event.target.mute();
    event.target.playVideo();
  }

  function onPlayerStateChange(event) {
    console.log("Player state changed:", event.data);
    // Handle different states if necessary
  }

  function onPlayerError(event) {
    console.error("YouTube Player encountered an error:", event.data);
    error.set("An error occurred with the YouTube player.");
  }

  /**
   * Toggles the mute state of the player.
   */
  function toggleMute() {
    if (player) {
      if (player.isMuted()) {
        player.unMute();
        isMuted.set(false);
      } else {
        player.mute();
        isMuted.set(true);
      }
    }
  }

  /**
   * Mutes the player.
   */
  function mute() {
    if (player && !player.isMuted()) {
      player.mute();
      isMuted.set(true);
    }
  }

  /**
   * Unmutes the player.
   */
  function unmute() {
    if (player && player.isMuted()) {
      player.unMute();
      isMuted.set(false);
    }
  }

  onDestroy(() => {
    if (player && player.destroy) {
      player.destroy();
    }
  });

  // Expose methods to parent components
  export { mute, unmute, toggleMute };
</script>

<style>
  /* Apply styles globally to all iframes inside .video-wrapper */
  :global(.video-wrapper iframe) {
    width: 100% !important;
    height: 100% !important;
    transform: scale(1.75);
    pointer-events: none !important;
  }

  .player-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .video-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 100%; /* Allow video to scale based on container */
    margin-bottom: 10px;
    overflow: hidden; /* Ensure scaling doesn't overflow */
  }


  .error-message {
    color: red;
    font-weight: bold;
  }
</style>

<div class="player-container">
  {#if $error}
    <p class="error-message">{$error}</p>
  {:else}
    <div class="video-wrapper">
      <div id="{playerId}"></div>
    </div>

    
  {/if}
</div>
