import {prisma} from "~/utils/db.server";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {MOVIE} from "~/types/movie-table";
import AddFilm from "~/components/add-film";

export const loader = async ({params}: LoaderFunctionArgs) => {
    try {
        const movies = await prisma.user_movie.findMany();
        console.log("DB has:", movies.length, "movies");
        return json({movies});
    } catch (err) {
        console.log("Error fetching data from DB");
        return json({err: "Error fetching data from DB"});
    }
};

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData()
    const title = formData.get("title") as string
    try {
        const movie = await prisma.user_movie.create({
            data: {
                name: title,
            }
        })
        console.log("done", movie)
        return movie
    } catch (er) {
        console.log("not done")
        return json({err: "Error adding movie"})
    }
}

function Films() {
    const {movies} = useLoaderData<{ movies: MOVIE[] }>();
    return (
        <div className="">
            <AddFilm/>
            {movies.length > 0 ? (
                <>
                    {movies?.map((movie) => (
                        <article title={movie?.name} key={movie?.id}>
                            <header>
                                <strong className={"movieName"}>{movie?.name}:</strong>
                            </header>
                            {/*<span style={{ fontWeight: 400 }}>{movie}</span>*/}

                        </article>
                    ))}
                </>
            ) : (
                <p>No movie found</p>
            )}
        </div>
    );
}

export default Films;
