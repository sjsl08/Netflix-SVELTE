    // src/routes/+page.ts
    import { fetchPopularTVShows, fetchTopRatedTVShows, fetchTrendingTVShows, getTMDBConfig, getTVGenres, getTVShowsByGenre } from '$lib/api/tmdb';
    import { config, popularTVShows, topRatedTVShows, trendingTVShows, tvGenres, tvShowsWithGenre } from '$lib/store/globalState';

    export async function load({ fetch }) {
        try {

            const [configRespoens,popularRespones, trendingRespones, topRatedRespones,genresRespones] = await Promise.all([
                getTMDBConfig(fetch),
                fetchPopularTVShows(fetch),
                fetchTrendingTVShows(fetch),
                fetchTopRatedTVShows(fetch),
                getTVGenres(fetch),  
            ]);


            console.log(genresRespones);
            
            const moviesByGenres = await Promise.all(
                genresRespones.map(async (genre:{id:string,name:string}) => {
                    const movies = await getTVShowsByGenre(fetch, genre.id);
                    return { id: genre.id, name: genre.name, movies };
                })
            );

            tvGenres.set(genresRespones)
            tvShowsWithGenre.set(moviesByGenres)
            config.set(configRespoens)
            popularTVShows.set(popularRespones)
            trendingTVShows.set(trendingRespones)
            topRatedTVShows.set(topRatedRespones)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }




