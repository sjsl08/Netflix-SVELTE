<script>
    export let isOpen = false;

    // Function to close the modal
    const closeModal = () => {
        isOpen = false;
    };
</script>

<style>
    /* Custom keyframes for bouncing slide-up and slide-down */
    @keyframes bounce-up {
        0% {
            transform: translateY(100%);
        }
        60% {
            transform: translateY(-10%);
        }
        80% {
            transform: translateY(5%);
        }
        100% {
            transform: translateY(0);
        }
    }

    @keyframes bounce-down {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(100%);
        }
    }

    .bounce-up {
        animation: bounce-up 0.5s ease-out forwards;
    }

    .bounce-down {
        animation: bounce-down 0.3s ease-in forwards;
    }
</style>

{#if isOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50" on:click={closeModal}>
        <div 
            class="bg-white w-full max-w-lg p-6 rounded-t-lg relative transition-transform duration-500 transform"
            class:isOpen={isOpen ? 'bounce-up' : 'bounce-down'}
            on:click|stopPropagation
        >
            <button 
                class="absolute top-3 right-3 text-gray-500 text-2xl font-bold"
                on:click={closeModal}
            >
                &times;
            </button>

            <slot></slot> <!-- Content of the modal goes here -->
        </div>
    </div>
{/if}
