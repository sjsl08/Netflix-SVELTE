// src/lib/tmdbStore.js
const API_KEY = '920a7b538bfb15120fe9dc6ced7735b0'; // Replace with your TMDB API key

const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchShows() {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data.results; // Adjust this if your API structure is different
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
}



// Function to fetch popular shows
export async function fetchPopularShows(): Promise<Show[]> {
  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  const data: TMDBResponse<Show> = await response.json();
  return data.results.map(show => ({
    id: show.id,
    title: show.name,
    image: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
  }));
}

// Function to fetch trending shows
export async function fetchTrendingShows(): Promise<Show[]> {
  const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const data: TMDBResponse<Show> = await response.json();
  
  return data.results.map(show => ({
    id: show.id,
    title: show.name,
    image: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
  }));
}

export interface Show {
  id: number;
  title: string;
  image: string;
}

export interface TMDBResponse<T> {
  results: T[];
}

// Function to fetch top-rated shows
export async function fetchTopRatedShows(): Promise<Show[]> {
  const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
  const data: TMDBResponse<Show> = await response.json();
  return data.results.map(show => ({
    id: show.id,
    title: show.name,
    image: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
  }));
}


// src/lib/api/tmdb.js


export async function fetchMoviesWithGenre(genreId, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        return data.results;  // Returns the list of movies
    } catch (error) {
        console.error('Error fetching movies with genre:', error);
        return [];
    }
}

export async function fetchTVShowsWithGenre(genreId, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch TV shows');
        const data = await response.json();
        return data.results;  // Returns the list of TV shows
    } catch (error) {
        console.error('Error fetching TV shows with genre:', error);
        return [];
    }
}
