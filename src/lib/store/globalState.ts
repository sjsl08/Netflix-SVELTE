// src/lib/store.ts

import type { Show } from "$lib/types/tmdb";
import { writable } from "svelte/store";
import type { MovieDetails } from "$lib/api/tmdb"; // Ensure you have this interface defined
import { getMovieById } from "$lib/api/tmdb"; // Import the API function

// Create a writable store for card view (boolean value)
export const cardView = writable(false);

// Create a writable store with an initial array of favorite items
export const myFav = writable<Show[]>([
  {
    id: 135157,
    title: "Alchemy of Souls",
    image: "https://image.tmdb.org/t/p/w500/q2IiPRSXPOZ6qVRj36WRAYEQyHs.jpg",
    poster_path: "/q2IiPRSXPOZ6qVRj36WRAYEQyHs.jpg",
  },
]);

// Configuration store
export const config = writable<any>({});

// Movies
export const moviesWithGenre = writable<any>([]);

// Create writable stores for popular, trending, and top-rated shows
export const popularShows = writable<any[]>([]);
export const trendingShows = writable<any[]>([]);
export const topRatedShows = writable<any[]>([]);

// TV Shows

// Create writable stores for popular, trending, and top-rated TV shows
export const popularTVShows = writable<any[]>([]);
export const trendingTVShows = writable<any[]>([]);
export const topRatedTVShows = writable<any[]>([]);

// Create writable store for TV genres
export const tvGenres = writable<any[]>([]);

// Create writable store for TV shows filtered by genre
export const tvShowsWithGenre = writable<any>({});

// Function to add an item to the myFav store
export function addItem(item: { id: number; title: string; image: string }) {
  myFav.update((currentItems) => [...currentItems, item]);
}

// Interface for the card state
interface CardState {
  isHovered: boolean;
  cardId: number | null;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  content: { title: string; description: string; poster_path: string } | null;
  item: null | any;
}

// Create a writable store for the card state
export const cardState = writable<CardState>({
  isHovered: false,
  item: null,
  cardId: null,
  position: { x: 0, y: 0 },
  dimensions: { width: 0, height: 0 },
  content: null,
});

// Modal State Interface
interface ModalState {
  isOpen: boolean;
  videoId: string;
  movieId: string;
  movieData: MovieDetails | null;
  loading: boolean;
  error: string | null;
}

// Initial Modal State
const initialState: ModalState = {
  isOpen: false,
  videoId: "",
  movieId: "",
  movieData: null,
  loading: false,
  error: null,
};

// Create the modal store
export const modalStore = writable<ModalState>(initialState);

// Cache for movie data to prevent redundant API calls
const movieCache: { [key: string]: MovieDetails } = {};

// Utility Functions

/**
 * Function to open the modal and fetch movie data
 * @param videoId - ID of the video to play
 * @param movieId - ID of the movie to fetch details for
 */
export const openModal = async (videoId: string, movieId: string) => {
  console.log(
    "Opening modal with Video ID:",
    videoId,
    "and Movie ID:",
    movieId
  );

  // Check if movie data is already cached
  if (movieCache[movieId]) {
    modalStore.set({
      isOpen: true,
      videoId,
      movieId,
      movieData: movieCache[movieId],
      loading: false,
      error: null,
    });
    return;
  }

  // Update the modal state to indicate loading
  modalStore.set({
    isOpen: true,
    videoId,
    movieId,
    movieData: null,
    loading: true,
    error: null,
  });

  cardState.update((state) => ({
    ...state,
    isHovered: false,
    item:null,
    position:{x:-500,y:0}
  }));

  try {
    // Fetch the movie data
    const movieData = await getMovieById(movieId);

    console.log(movieData);

    if (movieData) {
      // Cache the fetched movie data
      movieCache[movieId] = movieData;
    }

    // Update the modal store with fetched data
    modalStore.update((state) => ({
      ...state,
      movieData,
      loading: false,
    }));
  } catch (error) {
    console.error("Error fetching movie data:", error);

    // Update the modal store with error information
    modalStore.update((state) => ({
      ...state,
      loading: false,
      error: "Failed to load movie data.",
    }));
  }
};

/**
 * Function to close the modal
 */
export const closeModal = () => {
  modalStore.set(initialState); // Reset to initial state
};



export const favoriteListRefresh = writable(false)