<!-- src/lib/components/YouTubePlayer.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    
    // Generate a unique ID for each player instance to support multiple players
    import { v4 as uuidv4 } from 'uuid'; // Ensure you have installed uuid via `npm install uuid`
    
    export let videoId = 'M7lc1UVf-VE'; // Default YouTube video ID
    export let width = 560;
    export let height = 315;
    
    const isMuted = writable(true); // Initialize as muted
    const error = writable(null);
    let player;
    let playerId = `youtube-video-${uuidv4()}`; // Unique ID for the player container
    
    // Function to load the YouTube Iframe API
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
      try {
        const YT = await loadYouTubeAPI();
    
        player = new YT.Player(playerId, {
          videoId,
          width,
          height,
          playerVars: {
            enablejsapi: 1,
            autoplay: 1,     // Enable autoplay
            rel: 0,          // Disable related videos at the end
            mute: 1,         // Start muted
            controls: 0,     // Hide default controls
            modestbranding: 1, // Minimal YouTube branding
            disablekb: 1,    // Disable keyboard controls
            fs: 0,           // Disable fullscreen button
            iv_load_policy: 3, // Hide video annotations
            cc_load_policy: 0, // Disable closed captions
            showinfo: 0       // Deprecated, but included for older API versions
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
    
    onDestroy(() => {
      if (player && player.destroy) {
        player.destroy();
      }
    });
  </script>
  
  <style>
    .player-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
  
    .video-wrapper {
      position: relative;
      width: 100%;
      max-width: 560px;
      padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
      height: 0;
      margin-bottom: 10px;
    }
  
    #youtube-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
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
  
      <button on:click={toggleMute}>
        {#if $isMuted}
          Unmute
        {:else}
          Mute
        {/if}
      </button>
    {/if}
  </div>
