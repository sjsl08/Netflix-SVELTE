// src/lib/api/tmdb.ts

const API_KEY = '920a7b538bfb15120fe9dc6ced7735b0';  // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';

// Define common interfaces for Movie/TV Show data
interface MediaItem {
    id: number;
    title?: string; // Used for Movies
    name?: string;  // Used for TV Shows
    image: string;
    poster_path: string;
}

interface Genre {
    id: number;
    name: string;
}

interface TMDBConfig {
    images: {
        base_url: string;
        secure_base_url: string;
    };
}

interface TMDBResponse<T> {
    results: T[];
}

// TMDB Configuration
export async function getTMDBConfig(fetch: (url: string) => Promise<Response>): Promise<TMDBConfig> {
    const response = await fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`);
    const data: TMDBConfig = await response.json();
    return data;
}

// Movies
export async function fetchPopularShows(fetch: (url: string) => Promise<Response>): Promise<MediaItem[]> {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data: TMDBResponse<{ id: number; title: string; backdrop_path: string }> = await response.json();
    return data.results.map((show) => ({
        id: show.id,
        title: show.title,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}

export async function fetchTrendingShows(fetch: (url: string) => Promise<Response>): Promise<MediaItem[]> {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data: TMDBResponse<{ id: number; title: string; backdrop_path: string }> = await response.json();
    return data.results.map((show) => ({
        id: show.id,
        title: show.title,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}

export async function fetchTopRatedShows(fetch: (url: string) => Promise<Response>): Promise<MediaItem[]> {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data: TMDBResponse<{ id: number; title: string; backdrop_path: string }> = await response.json();
    return data.results.map((show) => ({
        id: show.id,
        title: show.title,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}

export async function getGenres(fetch: (url: string) => Promise<Response>): Promise<Genre[]> {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
}

export async function getMoviesByGenre(fetch: (url: string) => Promise<Response>, id: string): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${id}&page=1`);
        const data: TMDBResponse<{ id: number; title: string; backdrop_path: string }> = await response.json();
        return data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            image: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            poster_path: movie.backdrop_path,
        }));
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        return [];
    }
}

// TV Shows
export async function fetchPopularTVShows(fetch: (url: string) => Promise<Response>): Promise<MediaItem[]> {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
    const data: TMDBResponse<{ id: number; name: string; backdrop_path: string }> = await response.json();
    return data.results.map((show) => ({
        id: show.id,
        name: show.name,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}

export async function fetchTrendingTVShows(fetch: (url: string) => Promise<Response>): Promise<MediaItem[]> {
    const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
    const data: TMDBResponse<{ id: number; name: string; backdrop_path: string }> = await response.json();
    return data.results.map((show) => ({
        id: show.id,
        name: show.name,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}

export async function fetchTopRatedTVShows(fetch: (url: string) => Promise<Response>): Promise<MediaItem[]> {
    const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
    const data: TMDBResponse<{ id: number; name: string; backdrop_path: string }> = await response.json();
    return data.results.map((show) => ({
        id: show.id,
        name: show.name,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}

export async function getTVGenres(fetch: (url: string) => Promise<Response>): Promise<Genre[]> {
    const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
}

export async function getTVShowsByGenre(fetch: (url: string) => Promise<Response>, id: string): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${id}&page=1`);
        const data: TMDBResponse<{ id: number; name: string; backdrop_path: string }> = await response.json();
        return data.results.map((show) => ({
            id: show.id,
            name: show.name,
            image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
            poster_path: show.backdrop_path,
        }));
    } catch (error) {
        console.error('Error fetching TV shows by genre:', error);
        return [];
    }
}

// Movie Trailer
export async function getMovieTrailer(movieId: number | string): Promise<{ key: string } | null> {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        const trailer = data.results.find((video: {site : string,type:string }) => video.site === 'YouTube' && video.type === 'Trailer');
        return trailer || null;
    }
    return null;
}

// Get Movie by ID
export async function getMovieById(movieId: string): Promise<any | null> {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching movie with ID ${movieId}: ${response.statusText}`);
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        return null;
    }
}

// Similar Movies
export async function getSimilarMovies(movieId: number): Promise<MediaItem[]> {
    const url = `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&page=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching similar movies for ID ${movieId}: ${response.statusText}`);
        }
        const data: TMDBResponse<{ id: number; title: string; backdrop_path: string }> = await response.json();
        return data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            image: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            poster_path: movie.backdrop_path,
        }));
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        return [];
    }
}

// Search Movies
export async function searchMovies(keyword: string, page: number = 1): Promise<MediaItem[]> {
    if (!keyword.trim()) {
        return [];
    }

    const encodedKeyword = encodeURIComponent(keyword.trim());
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodedKeyword}&page=${page}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error searching movies with keyword "${keyword}": ${response.statusText}`);
        }
        const data: TMDBResponse<{ id: number; title: string; backdrop_path: string }> = await response.json();
        return data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            image: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            poster_path: movie.backdrop_path,
        }));
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}
