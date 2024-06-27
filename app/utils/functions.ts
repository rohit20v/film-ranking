import { User_movie } from "@prisma/client";
import process from "process";

type userMovies = { user_movies: User_movie[] };

export const addMoviesTitle = async (movies: userMovies): Promise<void> => {
    for (let i = 0; i < movies.user_movies.length; i++) {
        const res = await fetch(
            "http://173.212.203.208:5555/tconst/" + movies.user_movies[i].tconst
        );
        const movieData = await res.json();
        const response = await fetch(
            `https://www.omdbapi.com/?i=${movies.user_movies[i].tconst}&apikey=${process.env.OMDB_KEY}`
        );
        const moviePosterData = await response.json();
        movies.user_movies[i].name = movieData?.primaryTitle || " ";
        movies.user_movies[i].poster = moviePosterData?.Poster || "No poster found";
    }
};

export const getMoviePosterUrl = async (tconst: string): Promise<string> => {
    const response = await fetch(
        `https://www.omdbapi.com/?i=${tconst}&apikey=${process.env.OMDB_KEY}`
    );
    const moviePosterData = await response.json();
    const url = moviePosterData?.Poster || "No poster found";
    return url;
};
