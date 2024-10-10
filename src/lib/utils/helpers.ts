import { cardState, favoriteListRefresh } from "$lib/store/globalState";
import { get } from "svelte/store";

// Define a TypeScript interface for the movie object
export interface Movie {
  id: string;
  title: string;
  image: string;
  poster_path: string;
}

export const addToList = (movie: Movie) => {
  console.log("Adding movie to list:", movie);

  // Retrieve the existing list from localStorage
  let list = localStorage.getItem("list");

  // Initialize an array to hold the movies
  let movieList: Movie[] = [];

  if (list) {
    try {
      // Parse the existing list
      movieList = JSON.parse(list);

      // Optional: Check if the movie already exists in the list to prevent duplicates
      const exists = movieList.some((m) => m.id === movie.id);
      if (exists) {
        console.log("Movie already exists in the list.");
        movieList = movieList.filter((item) => {
          return item.id != movie.id;
        });
        localStorage.setItem("list", JSON.stringify(movieList));

        cardState.update((state) => ({
          ...state,
          isHovered: false,
          item: null,
          position: { x: -500, y: 0 },
        }));

        favoriteListRefresh.set(!get(favoriteListRefresh));

        return; // Exit the function if the movie is already in the list
      }
    } catch (error) {
      console.error("Error parsing the movie list from localStorage:", error);
      // If parsing fails, you might want to clear the invalid data
      localStorage.removeItem("list");
      movieList = [];
    }
  }

  // Add the new movie to the list
  movieList.push(movie);

  // Save the updated list back to localStorage
  try {
    localStorage.setItem("list", JSON.stringify(movieList));
    console.log("Movie added successfully.");
  } catch (error) {
    console.error("Error saving the movie list to localStorage:", error);
  }
};

export const getList = () => {
  // const list = localStorage.getItem("list");
  // if (list) {
  //   try {
  //     return JSON.parse(list);
  //   } catch (error) {
  //     console.error("Error parsing the movie list from localStorage:", error);
  //     return [];
  //   }
  // }
  // return [];
};

export function convertMinutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60); // Calculate whole hours
  const mins = minutes % 60; // Calculate remaining minutes
  return hours === 0 ? `${mins}m` : `${hours}h ${mins}m`;
}
