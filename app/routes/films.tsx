import {prisma} from "~/.server/db";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, useFetcher, useLoaderData} from "@remix-run/react";
import AddFilm from "~/components/add-film";
import Rating from "~/components/Star";
import {getMoviePosterUrl, getMovieTitle} from "~/.server/functions";
import MoviePoster from "~/components/MoviePoster";
import {checkLogin} from "~/.server/auth";

export type searchedMovie = {
    tconst: string
    titleType: string
    primaryTitle: string
    originalTitle: string
    startYear: number
    averageRating: number
    numVotes: number
}
const getUserMovies = async (user: string): Promise<user_movies[]> => {
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
const searchMovie = async (search: string): Promise<searchedMovie[]> => {
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
    } else {
        if (tconst) {
            const url = await getMoviePosterUrl(tconst);
            return json({searchedMovies: null, movies: null, posterUrl: url,});
        }
    }
    return json({
        searchedMovies: null,
        movies: null,
        posterUrl: null,
    });
};

export const action = async ({request}: ActionFunctionArgs) => {
    const user = await checkLogin(request)

    const formData = await request.formData();
    const formType = formData.get("formType");

    if (formType === "addFilm") {
        const tconst: string = formData.get("tconst") as string;
        const movieTitle = await getMovieTitle(tconst);
        console.log("ADDDING FILM tconst", tconst);
        try {
            const userId = await prisma.user.findUnique({
                where: {username: user},
                select: {id: true},
            });

            if (!userId) {
                return json({err: "Error adding movie"});
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
            return json(movie);
        } catch (error) {
            console.log("Error adding movie:", error);
            return json({err: "Error adding movie"});
        }
    } else if (formType === "updateRating") {
        const movieId = formData.get("movieId");
        const newRating = formData.get("newRating");

        try {
            const updatedMovie = await prisma.user_movie.update({
                where: {id: parseInt(movieId as string)},
                data: {rating: parseInt(newRating as string)},
            });
            return json({updatedMovie});
        } catch (error) {
            console.log("Error updating rating:", error);
            return json({err: "Error updating rating"});
        }
    } else if (formType === "removeMovie") {
        const movieId = formData.get("movieId");
        try {
            const removeMovie = await prisma.user_movie.delete({
                where: {id: parseInt(movieId as string)},
            });
            return json({removeMovie});
        } catch (err) {
            return json({err: "Error removing movie"});
        }
    }
};

function Films() {
    const data= useLoaderData<typeof loader>();
    const user_movies = data?.movies??[];

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
                    <h2>
                        <span>
                            Watched Movies{" "}
                            <a className={"goTo"} href="#not-watched">
                                Go to movies in queue
                            </a>
                        </span>
                    </h2>

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
                    <h2>
                        <span>
                            Not-watched Movies{" "}
                            <a className={"goTo"} href="#watched">
                                Go to watched movies
                            </a>
                        </span>
                    </h2>
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
