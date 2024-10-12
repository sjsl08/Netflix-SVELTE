<!-- src/routes/+error.svelte -->
<script lang="ts">
    export let error: Error | undefined;
    export let status: number;
  </script>
  
  <div class="min-h-screen flex flex-col items-center justify-center  p-4">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-red-500 dark:text-red-400">404</h1>
        <p class="mt-4 text-2xl text-gray-700 dark:text-gray-300">Oops! Page Not Found.</p>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          class="mt-6 inline-block  text-white px-6 py-3 rounded-md hover:bg-slate-950 transition"
        >
          Go Back Home
        </a>
      </div>
   
  </div>
  