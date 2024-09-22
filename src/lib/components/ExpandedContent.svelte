<!-- ExpandedContent.svelte -->
<script lang="ts">
    export let onClose: () => void;
  </script>
  
  <style>
    .expanded-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      max-height: 90vh;
      overflow-y: auto;
      position: relative; /* Ensure the close button is positioned correctly */
    }
  
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: red;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      cursor: pointer;
    }
  </style>
  
  <div class="expanded-content">
   
    <p>Your expanded content goes here.</p>
    <!-- Add more detailed content here -->
  </div>
  