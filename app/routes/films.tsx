import {prisma} from "~/utils/db.server";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {redirect, useLoaderData} from "@remix-run/react";
import AddFilm from "~/components/add-film";
import {getSession} from "~/session";
import {User_movie} from "@prisma/client";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"))
    const user = session.data.user;
    if (!user) { //verify if the user is logged
        return redirect("/login");
    }
    try {
        const movies = await prisma.user.findFirst({
            where: {
                username: user
            },
            select: {
                user_movies: true
            }
        });
        //console.log("UserMovies ", movies);
        return json(movies);
    } catch (err) {
        console.log("Error fetching data from DB");
        return json({err: "Error fetching data from DB"});
    }
};

export const action = async ({request}: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"))
    const user = session.data.user;
    if (!user) { //verify if the user is logged
        return redirect("/login");
    }

    const formData = await request.formData()
    const title: string = formData.get("title") as string

    try {
        const userId = await prisma.user.findUnique({
            where: {username: user},
            select: {id: true}
        })

        console.log(userId)

        if (!userId) {
            return json({err: "Error adding movie"})
        }
        const movie = await prisma.user_movie.create({
            data: {
                user_id: userId.id,
                name: title,
                rating: 0,
                created_at: new Date(),
                tconst: "TODO"
            }
        })
        console.log("ADDED MOVIE", movie)
        return json(movie)
    } catch (er) {
        console.log("not done")
        return json({err: "Error adding movie"})
    }
}


function Films() {
    const data = useLoaderData<{ user_movies: User_movie[] }>() || {};
    const user_movies = data?.user_movies

    return (
        <div className="">
            <AddFilm/>

            {user_movies?.length > 0 ? (
                <>
                    {user_movies?.map((movie) => (
                        <article title={movie?.name} key={movie?.id}>
                            <header>
                                <strong className={"movieName"}>{movie?.name}</strong>
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
