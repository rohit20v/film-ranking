import { prisma } from "~/utils/db.server";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import AddFilm from "~/components/add-film";
import { getSession } from "~/session";
import Rating from "~/components/Star";
import { addMoviesTitle, getMoviePosterUrl } from "~/utils/functions";
import MoviePoster from "~/components/MoviePoster";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"));
    const user = session.data.user;
    if (!user) {
        //verify if the user is logged
        return redirect("/login");
    }

    const q = new URL(request.url).searchParams.get("title");
    const tconst = new URL(request.url).searchParams.get("tconst");

    if (!q && !tconst) {
        try {
            const movies = await prisma.user.findFirst({
                where: {
                    username: user,
                },
                select: {
                    user_movies: true,
                },
            });
            if (!movies) throw new Error("Error");

            await addMoviesTitle(movies);

            return json({ err: null, movies, searchedMovies: null });
        } catch (err) {
            console.log("Error fetching data from DB");
            return json({ err: "Error fetching data from DB", movies: null });
        }
    }

    if (q) {
        const movieLet = q;
        if (!movieLet || movieLet === "") {
            return json({ err: null, movies: null });
        }
        try {
            console.log("Searching", movieLet);
            const res = await fetch(`http://173.212.203.208:5555/search/${movieLet}`);
            const searchedMovies = await res.json();
            console.log(searchedMovies);
            if (searchedMovies?.err) {
                return json({ err: "No movie found", searchedMovies: [], movies: null });
            }
            return json({ err: null, searchedMovies, movies: null });
        } catch (e) {
            return json({ err: "Error while searching" });
        }
    } else {
        if (tconst) {
            const url = await getMoviePosterUrl(tconst);
            return json({
                err: null,
                searchedMovies: null,
                movies: null,
                posterUrl: url,
            });
        }
        return json({
            err: "Error fetching poster img",
            searchedMovies: null,
            movies: null,
            posterUrl: null,
        });
    }
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"));
    const user = session.data.user;
    if (!user) {
        // Verify if the user is logged in
        return redirect("/login");
    }

    const formData = await request.formData();
    const formType = formData.get("formType");

    if (formType === "addFilm") {
        const tconst: string = formData.get("tconst") as string;
        console.log("ADDDING FILM tconst", tconst);
        try {
            const userId = await prisma.user.findUnique({
                where: { username: user },
                select: { id: true },
            });

            if (!userId) {
                return json({ err: "Error adding movie" });
            }
            const movie = await prisma.user_movie.create({
                data: {
                    user_id: userId.id,
                    tconst: tconst,
                    rating: 0,
                    created_at: new Date(),
                },
            });
            return json(movie);
        } catch (error) {
            console.log("Error adding movie:", error);
            return json({ err: "Error adding movie" });
        }
    } else if (formType === "updateRating") {
        const movieId = formData.get("movieId");
        const newRating = formData.get("newRating");

        try {
            const updatedMovie = await prisma.user_movie.update({
                where: { id: parseInt(movieId as string) },
                data: { rating: parseInt(newRating as string) },
            });
            return json({ updatedMovie });
        } catch (error) {
            console.log("Error updating rating:", error);
            return json({ err: "Error updating rating" });
        }
    } else if (formType === "removeMovie") {
        const movieId = formData.get("movieId");
        try {
            const removeMovie = await prisma.user_movie.delete({
                where: { id: parseInt(movieId as string) },
            });
            return json({ removeMovie });
        } catch (err) {
            return json({ err: "Error removing movie" });
        }
    }
};

function Films() {
    const data = useLoaderData<typeof loader>() || {};
    const user_movies = data.movies?.user_movies ?? [];

    const watchedMovies = user_movies.filter((movie) => parseInt(movie.rating) > 0);
    const not_watchedMovies = user_movies.filter((movie) => parseInt(movie.rating) === 0);

    const fetcher = useFetcher();
    const removeMovie = async (movieId: number) => {
        const formData = new FormData();
        formData.append("formType", "removeMovie");
        formData.append("movieId", String(movieId));
        fetcher.submit(formData, { method: "post", action: "/films" });
    };

    return (
        <div>
            <AddFilm />
            <div className="grid">
                <div id={"watched"} style={{ display: "flex", flexDirection: "column" }}>
                    <h2>
                        <span>
                            Watched Movies{" "}
                            <a className={"goTo"} href="#not-watched">
                                Go to movies in queue
                            </a>
                        </span>
                    </h2>
                    {watchedMovies.length > 0 ? (
                        watchedMovies.reverse().map((movie) => (
                            <article className={"movieCard"} title={movie.name} key={movie.id}>
                                <header>
                                    <strong className="movieName">{movie.name}</strong>
                                </header>
                                <MoviePoster name={movie.name} tconst={movie.tconst} />
                                <footer>
                                    <Rating movieId={movie.id} rating={parseInt(movie.rating)} />
                                </footer>
                            </article>
                        ))
                    ) : (
                        <span>No movie found</span>
                    )}
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
                                title={movie.name}
                                key={movie.id}
                            >
                                <header>
                                    <Form
                                        style={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <strong className="movieName">{movie.name}</strong>
                                        <p
                                            onClick={() => removeMovie(movie.id)}
                                            className={"remove"}
                                        >
                                            Remove
                                        </p>
                                    </Form>
                                </header>
                                <MoviePoster name={movie.name} tconst={movie.tconst} />
                                <footer>
                                    <Rating movieId={movie.id} rating={parseInt(movie.rating)} />
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
