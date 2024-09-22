// src/lib/api/tmdb.ts

const API_KEY = '920a7b538bfb15120fe9dc6ced7735b0';  // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';


export async function getTMDBConfig(fetch:(url:string)=>Promise<Response>){

    const response = await fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`);
    const data = await response.json();
    return data

}

export async function fetchPopularShows(fetch: (url: string) => Promise<Response>) {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    console.log(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    
    const data = await response.json();

    console.log(data.results[0]);
    
    
    return data.results.map((show: any) => ({
        id: show.id,
        title: show.title,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}

export async function fetchTrendingShows(fetch: (url: string) => Promise<Response>) {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    
    return data.results.map((show: any) => ({
        id: show.id,
        title: show.title,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}

export async function fetchTopRatedShows(fetch: (url: string) => Promise<Response>) {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data = await response.json();
    
    return data.results.map((show: any) => ({
        id: show.id,
        title: show.title,
        image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
        poster_path: show.backdrop_path,
    }));
}



export async function getGenres(fetch : (url: string) => Promise<Response>) {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
}


export async function getMoviesByGenre(fetch: (url: string) => Promise<Response>, id: string): Promise<any[]> {
    try {
        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${id}&page=1`);
        const data = await response.json();


        return data.results.map((movie: any) => ({
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
