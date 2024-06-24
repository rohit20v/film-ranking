import {prisma} from "~/utils/db.server";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {redirect, useLoaderData} from "@remix-run/react";
import AddFilm from "~/components/add-film";
import {getSession} from "~/session";
import Rating from "~/components/Star";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"));
    const user = session.data.user;
    if (!user) {
        //verify if the user is logged
        return redirect("/login");
    }
    const q = new URL(request.url).searchParams.get("title")

    if (!q) {
        try {
            const movies = await prisma.user.findFirst({
                where: {
                    username: user,
                },
                select: {
                    user_movies: true,
                },
            });
            for (let i = 0; i < movies.user_movies.length; i++){
                const res = await fetch("http://173.212.203.208:5555/tconst/" + movies.user_movies[i].tconst)
                const movieData = await res.json()
                movies.user_movies[i].name = movieData?.primaryTitle || "NULL";
                console.log(movies.user_movies[i].name)
            }
            return json({err: null, movies, searchedMovies: null});
        } catch (err) {
            console.log("Error fetching data from DB");
            return json({err: "Error fetching data from DB", movies: null});
        }
    } else {
        const movieLet = q
        if (!movieLet || movieLet === "") {
            return json({err: null, movies: null});
        }
        try {
            console.log("Searching", movieLet);
            const res = await fetch(
                `http://173.212.203.208:5555/search/${movieLet}`,
            );
            const searchedMovies = await res.json();
            return json({err: null, searchedMovies, movies: null});
        } catch (e) {
            return json({err: "Error while searching"});
        }
    }

};

export const action = async ({request}: ActionFunctionArgs) => {
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
        console.log("ADDDING FILM tconst", tconst)
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
                    rating: 0,
                    created_at: new Date()
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
    }
};

function Films() {
    const {movies} = useLoaderData<typeof loader>() || {};
    const user_movies = movies?.user_movies ?? [];

    return (
        <div>
            <AddFilm/>

            {user_movies.length > 0 ? (
                user_movies
                    .slice()
                    .reverse()
                    .map((movie) => {
                        return (
                            <article title={movie.name} key={movie.id}>
                                <header>
                                    <strong className="movieName">
                                        {movie.name }
                                    </strong>
                                </header>
                                <Rating
                                    movieId={movie.id}
                                    rating={parseInt(movie.rating)}
                                />
                            </article>
                        )
                    })
            ) : (
                <p>No movie found</p>
            )}
        </div>
    );
}

export default Films;
