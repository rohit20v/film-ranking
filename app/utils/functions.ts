import {User_movie} from "@prisma/client";

type userMovies = {user_movies: User_movie[]}

export const addMoviesTitle = async (movies: userMovies): Promise<void>=>{
    for (let i = 0; i < movies.user_movies.length; i++){
        const res = await fetch("http://173.212.203.208:5555/tconst/" + movies.user_movies[i].tconst)
        const movieData = await res.json()
        movies.user_movies[i].name = movieData?.primaryTitle || " ";
    }

}