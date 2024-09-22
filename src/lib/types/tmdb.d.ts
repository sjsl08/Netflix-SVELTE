// src/types/tmdb.d.ts

export interface Show {
    id: number;
    title: string;
    image?: string;
    poster_path?: string; // Add this if you need it in the API functions
  }
  
  export interface TMDBResponse<T> {
    results: T[];
  }
  