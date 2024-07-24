import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, useFetcher, useLoaderData} from "@remix-run/react";
import AddFilm from "~/components/add-film";
import Rating from "~/components/Star";
import {
    addFilm,
    getMoviePosterUrl,
    getUserMovies, removeMovie,
    searchedMovie,
    searchMovie, updateMovieRating
} from "~/.server/functions";
import MoviePoster from "~/components/MoviePoster";
import {checkLogin} from "~/.server/auth";


export const loader = async ({request}: LoaderFunctionArgs) => {
    const user = await checkLogin(request)

    const q = new URL(request.url).searchParams.get("title");
    const tconst = new URL(request.url).searchParams.get("tconst");

    if (!q && !tconst) {
        const movies = await getUserMovies(user)
        return json({movies, searchedMovies: null, posterUrl: null});
    }
    if (q) {
        const searchedMovies: searchedMovie[] = await searchMovie(q)
        return json({movies: null, searchedMovies, posterUrl: null})
    } else if (tconst) {
        const url = await getMoviePosterUrl(tconst);
        return json({searchedMovies: null, movies: null, posterUrl: url,});
    }
    return json({searchedMovies: null, movies: null, posterUrl: null,});
};

export const action = async ({request}: ActionFunctionArgs) => {
    const user = await checkLogin(request)

    const formData = await request.formData();
    const formType = formData.get("formType");

    if (formType === "addFilm") {
        const tconst: string = formData.get("tconst") as string;
        const {movie, err} = await addFilm(tconst, user)
        return json({err, movie});
    } else if (formType === "updateRating") {
        const movieId = formData.get("movieId");
        const newRating = formData.get("newRating");
        const {err} = await updateMovieRating(Number(movieId), Number(newRating), user)
        return json({err, movie: null});
    } else if (formType === "removeMovie") {
        const movieId = formData.get("movieId");
        const {err} = await removeMovie(Number(movieId), user)
        return json({err, movie: null});
    }
};

function Films() {
    const data = useLoaderData<typeof loader>();
    const user_movies = data?.movies ?? [];

    const watchedMovies = user_movies.filter((movie) => parseInt(movie.rating) > 0);
    const not_watchedMovies = user_movies.filter((movie) => parseInt(movie.rating) === 0);

    const fetcher = useFetcher();
    const removeMovie = async (movieId: number) => {
        const formData = new FormData();
        formData.append("formType", "removeMovie");
        formData.append("movieId", String(movieId));
        fetcher.submit(formData, {method: "post", action: "/films"});
    };

    return (
        <div>
            <AddFilm/>
            <div className="grid">
                <div id={"watched"} style={{display: "flex", flexDirection: "column"}}>
                    <h3>
                        <span>
                            Watched Movies{" "}
                            <a className={"goTo"} href="#not-watched">
                                Go to movies in queue
                            </a>
                        </span>
                    </h3>

                    <div>
                        {watchedMovies.length > 0 ? (
                            watchedMovies.reverse().map((movie) => (
                                    <article className={"movieCard"} title={movie.title} key={movie.id}>
                                        <header>
                                            <MoviePoster name={movie.title} tconst={movie.tconst}/>
                                        </header>
                                        <strong className="movieName">{movie.title}</strong>
                                        <Rating movieId={movie.id} rating={parseInt(movie.rating)}/>
                                    </article>
                                )
                            )
                        ) : (
                            <span>No movie found</span>
                        )}
                    </div>
                </div>
                <div id={"not-watched"} className={"not-watched"}>
                    <h3>
                        <span>
                            Not-watched Movies{" "}
                            <a className={"goTo"} href="#watched">
                                Go to watched movies
                            </a>
                        </span>
                    </h3>
                    {not_watchedMovies.length > 0 ? (
                        not_watchedMovies.reverse().map((movie) => (
                            <article
                                className={"movieCard"}
                                id={"queue"}
                                title={movie.title}
                                key={movie.id}
                            >
                                <header>
                                    <Form
                                        style={{display: "flex", justifyContent: "space-between"}}
                                    >
                                        <strong className="movieName">{movie.title}</strong>
                                        <p
                                            onClick={() => removeMovie(movie.id)}
                                            className={"remove"}
                                        >
                                            Remove
                                        </p>
                                    </Form>
                                </header>
                                <MoviePoster name={movie.title} tconst={movie.tconst}/>
                                <footer>
                                    <Rating movieId={movie.id} rating={parseInt(movie.rating)}/>
                                </footer>
                            </article>
                        ))
                    ) : (
                        <span>No movie found</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Films;
