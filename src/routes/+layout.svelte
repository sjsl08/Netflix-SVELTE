<script lang="ts">
  import PopupCard from "$lib/components/PopupCard.svelte";
  import "../app.css";
  import { cardState } from "$lib/store/globalState";
  import Modal from "$lib/components/Modal.svelte";
  import Header from "$lib/components/Header.svelte";
  import Player from "$lib/components/Player.svelte";
  let isModalOpen: boolean = false;
</script>

<Header />

<slot />

<Modal bind:isOpen={isModalOpen}></Modal>

<PopupCard
  x={$cardState.position.x}
  y={$cardState.position.y + 250}
  isHovered={$cardState.isHovered}
  dimensions={$cardState.dimensions}
/>
