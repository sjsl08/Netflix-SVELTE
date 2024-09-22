<script>
    import PopupCard from "$lib/components/PopupCard.svelte";
    import "../app.css";
    import {cardState} from '$lib/store/globalState'
  </script>
  
  <slot />

  <PopupCard 
  x={$cardState.position.x} 
  y={$cardState.position.y +250} 
  isHovered={$cardState.isHovered} 
  dimensions={$cardState.dimensions}
/>