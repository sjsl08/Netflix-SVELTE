    // src/routes/+page.ts
    import { fetchPopularShows, fetchTrendingShows, fetchTopRatedShows, getTMDBConfig, getGenres, getMoviesByGenre } from '$lib/api/tmdb';
    import { popularShows, trendingShows, topRatedShows, config, moviesWithGenre } from '$lib/store/globalState';

    export async function load({ fetch }) {
        try {

            const [configRespoens,popularRespones, trendingRespones, topRatedRespones,genresRespones] = await Promise.all([
                getTMDBConfig(fetch),
                fetchPopularShows(fetch),
                fetchTrendingShows(fetch),
                fetchTopRatedShows(fetch),
                getGenres(fetch),  
            ]);


            const moviesByGenres = await Promise.all(
                genresRespones.map(async (genre:{id:string,name:string}) => {
                    const movies = await getMoviesByGenre(fetch, genre.id);
                    return { id: genre.id, name: genre.name, movies };
                })
            );

            
            moviesWithGenre.set(moviesByGenres)
            config.set(configRespoens)
            popularShows.set(popularRespones)
            trendingShows.set(trendingRespones)
            topRatedShows.set(topRatedRespones)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }




