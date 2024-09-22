// src/routes/+page.ts
import { fetchPopularShows, fetchTrendingShows, fetchTopRatedShows } from '$lib/api/tmdb';

export async function load({ fetch }) {
    try {
        const popularShows = await fetchPopularShows(fetch);
        const trendingShows = await fetchTrendingShows(fetch);
        const topRatedShows = await fetchTopRatedShows(fetch);
        console.log("hello");
        
        return {
            props: {
                popularShows,
                trendingShows,
                topRatedShows
            }
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                popularShows: [],
                trendingShows: [],
                topRatedShows: []
            }
        };
    }
}

