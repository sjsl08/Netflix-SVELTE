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
  } 
  px-3 py-2 
  sm:px-4 sm:py-2 
  md:px-5 md:py-3 
  lg:px-6 lg:py-3 
  rounded flex items-center justify-center 
  text-sm 
  sm:text-base 
  md:text-lg 
  font-medium 
  transition-colors duration-200 
  ease-in-out 
  ${className}`}
>
  <slot />
</button>

<style>
  /* Additional styles can be added here if needed */
  button:focus {
      outline: none;
      /* ring: 2px solid #ffffff;
      ring-offset-2px; */
  }
</style>
