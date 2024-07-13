import process from "process";
import {prisma} from "~/.server/db";
import {json} from "@remix-run/node";

export const getMovieTitle = async (tconst: string): Promise<string> => {
    const res = await fetch("http://173.212.203.208:5555/tconst/" + tconst);
    const movieData = await res.json();
    return movieData?.primaryTitle || " ";
};

export const getMoviePosterUrl = async (tconst: string): Promise<string> => {
    const response = await fetch(
        `https://www.omdbapi.com/?i=${tconst}&apikey=${process.env.OMDB_KEY}`
    );
    const moviePosterData = await response.json();
    const url = moviePosterData?.Poster || "No poster found";
    return url;
};

export type searchedMovie = {
    tconst: string
    titleType: string
    primaryTitle: string
    originalTitle: string
    startYear: number
    averageRating: number
    numVotes: number
}
export const getUserMovies = async (user: string): Promise<user_movies[]> => {
    try {
        const movies = await prisma.user.findFirst({
            where: {
                username: user,
            },
            select: {
                user_movies: true,
            },
        });
        if (!movies) return []
        return movies.user_movies;
    } catch (err) {
        console.log("Error fetching data from DB");
        return []
    }
}
export const searchMovie = async (search: string): Promise<searchedMovie[]> => {
    if (!search || search === "") {
        return []
    }
    const startTime = performance.now()
    try {
        console.log("Searching", search);
        const res = await fetch(`http://173.212.203.208:5555/search/${search}`);
        const searchedMovies = await res.json();
        if (searchedMovies?.err) {
            return []
        }
        const endTime = performance.now()
        console.log(`Fetched in  ${endTime - startTime} milliseconds`)
        return searchedMovies
    } catch (e) {
        return []
    }
}

export const addFilm = async (tconst: string, user: string) => {
    const movieTitle = await getMovieTitle(tconst);
    console.log("ADDDING FILM tconst", tconst, "to user", user);
    try {
        const userId = await prisma.user.findUnique({
            where: {username: user},
            select: {id: true},
        });

        if (!userId) {
            return {err: "Error adding movie", movie: null};
        }
        const movie = await prisma.user_movie.create({
            data: {
                user_id: userId.id,
                tconst: tconst,
                title: movieTitle,
                rating: 0,
                created_at: new Date(),
            },
        });
        return {err: null, movie};
    } catch (error) {
        console.log("Error adding movie:", error);
        return {err: "Error adding movie"};
    }
}

const checkUserHasMovie = async (user: string, movieId: number): Promise<boolean> => {
    const userMovie = await prisma.user_movie.findUnique({
        where: {
            id: movieId,
            user: {username: user}
        },
    });
    console.log(userMovie)
    if (userMovie?.id) { //the user has created that movie
        return true
    }
    return false
}

export const updateMovieRating = async (movieId: number, newRating: number, user: string) => {
    const movieOwner = await checkUserHasMovie(user, movieId)
    if (!movieOwner){
        return {err: "Movie not created by the user"}
    }
    try {
        await prisma.user_movie.update({
            where: {id: movieId},
            data: {rating: newRating},
        });
        return {err: null};
    } catch (error) {
        console.log("Error updating rating:", error);
        return {err: "Error updating rating"};
    }
}

export const removeMovie = async (movieId: number, user: string) => {
    const movieOwner = await checkUserHasMovie(user, movieId)
    if (!movieOwner){
        return {err: "Movie not created by the user"}
    }
    try {
        await prisma.user_movie.delete({
            where: {id: movieId},
        });
        return {err: null};
    } catch (err) {
        return {err: "Error removing movie"};
    }
}