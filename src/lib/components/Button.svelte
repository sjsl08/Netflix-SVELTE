<!-- src/lib/components/Button.svelte -->
<script>
    export let variant = "primary"; // "primary" or "outline"
    export let className = ""; // Additional classes if needed
  </script>
  
  <button
    class={`${
      variant === "outline"
        ? "border border-white text-white bg-transparent hover:bg-white hover:text-black"
        : "bg-white text-black hover:bg-gray-200"
    } px-4 py-2 rounded flex items-center justify-center ${className}`}
  >
    <slot />
  </button>
  
  <style>
    /* Additional styles can be added here if needed */
  </style>
  