// src/lib/store.ts

import type { Show } from '$lib/types/tmdb';
import { writable } from 'svelte/store';

// Create a writable store for card view (boolean value)
export const cardView = writable(false);

// Create a writable store with an initial array of favorite items
export const myFav = writable<Show[]>([{
    "id": 135157,
    "title": "Alchemy of Souls",
    "image": "https://image.tmdb.org/t/p/w500/q2IiPRSXPOZ6qVRj36WRAYEQyHs.jpg",
    "poster_path": "/q2IiPRSXPOZ6qVRj36WRAYEQyHs.jpg"
}])

export const config = writable<any>({})

export const moviesWithGenre = writable<any>({})

// Create a writable store for popular shows
export const popularShows = writable<any[]>([]);

// Create a writable store for trending shows
export const trendingShows = writable<any[]>([]);

// Create a writable store for top-rated shows
export const topRatedShows = writable<any[]>([]);

// Function to add an item to the myFav store
export function addItem(item: { id: number; title: string; image: string }) {
    myFav.update(currentItems => [
        ...currentItems,
        item
    ]);
}

interface CardState {
    isHovered: boolean;
    cardId: number | null;
    position: { x: number; y: number };
    dimensions: { width: number; height: number };
    content: { title: string; description: string; poster_path: string } | null;
    item: null |any
  }
  
  export const cardState = writable<CardState>({
    isHovered: false,
    item: null,
    cardId: null,
    position: { x: 0, y: 0 },
    dimensions: { width: 0, height: 0 },
    content: null
  });