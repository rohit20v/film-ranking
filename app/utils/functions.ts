import process from "process";

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
