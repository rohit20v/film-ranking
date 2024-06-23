import {prisma} from "~/utils/db.server";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, redirect, useFetcher, useLoaderData} from "@remix-run/react";
import AddFilm from "~/components/add-film";
import {getSession} from "~/session";
import Rating from "~/components/Star";


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
        return json({err: null, movies});
    } catch (err) {
        console.log("Error fetching data from DB");
        return json({err: "Error fetching data from DB", movies: null});
    }
};


export const action = async ({request}: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get('cookie'));
    const user = session.data.user;
    if (!user) {
        // Verify if the user is logged in
        return redirect('/login');
    }

    const formData = await request.formData();
    const formType = formData.get('formType');
    console.log("formType", formType)
    if (formType === 'addFilm') {
        const title: string = formData.get('title') as string;
        try {
            const userId = await prisma.user.findUnique({
                where: {username: user},
                select: {id: true},
            });

            if (!userId) {
                return json({err: 'Error adding movie'});
            }
            const movie = await prisma.user_movie.create({
                data: {
                    user_id: userId.id,
                    name: title,
                    rating: 0,
                    created_at: new Date(),
                    tconst: 'TODO',
                },
            });
            return json(movie);
        } catch (error) {
            console.log('Error adding movie:', error);
            return json({err: 'Error adding movie'});
        }
    } else if (formType === 'updateRating') {
        const movieId = formData.get('movieId');
        const newRating = formData.get('newRating');

        try {
            const updatedMovie = await prisma.user_movie.update({
                where: {id: parseInt(movieId as string)},
                data: {rating: parseInt(newRating as string)},
            });
            return json({updatedMovie});
        } catch (error) {
            return json({err: 'Error updating rating'});
        }
    } else if (formType === 'searchFilm') {
        const movieLet = formData.get('title')
        try {
            const movies = await fetch(`http://173.212.203.208:5555/search/${movieLet}`)
            console.log(movies)
            return json( movies)
        }catch (e){
            console.log(e)
        }
        return movieLet
    } else if (formType === 'removeMovie') {
        const movieId = formData.get('movieId')
        try {
            const removeMovie = await prisma.user_movie.delete({
                where: {id: parseInt(movieId as string)},
            })
            return json({removeMovie})
        } catch (err) {
            return json({err: 'Error removing movie'});
        }
    }
};


function Films() {
    const {err, movies} = useLoaderData<typeof loader>() || {};
    const user_movies = movies?.user_movies ?? []

    const watchedMovies = user_movies.filter(movie => parseInt(movie.rating) > 0);
    const not_watchedMovies = user_movies.filter(movie => parseInt(movie.rating) === 0);

    const fetcher = useFetcher();
    const removeMovie = async (movieId) => {
        const formData = new FormData();
        formData.append('formType', 'removeMovie');
        formData.append('movieId', movieId);
        fetcher.submit(formData, { method: "post", action: "/films" });
    }

    return (
        <div>
            <AddFilm/>
            <div className="grid">
                <div>
                    <h2>Watched Movies</h2>
                    {watchedMovies.length > 0 ? (
                        watchedMovies.reverse().map(movie => (
                            <article title={movie.name} key={movie.id}>
                                <header>
                                    <strong className="movieName">{movie.name}</strong>
                                </header>
                                <Rating movieId={movie.id} rating={parseInt(movie.rating)}/>
                            </article>
                        ))
                    ) : (
                        <p>No movie found</p>
                    )}
                </div>

                <div>
                    <h2>Not-watched Movies</h2>
                    {not_watchedMovies.length > 0 ? (
                        not_watchedMovies.reverse().map(movie => (
                            <article title={movie.name} key={movie.id}>
                                <header>
                                    <Form style={{display: "flex", justifyContent: "space-between"}}>
                                        <strong className="movieName">{movie.name}</strong>
                                        <p onClick={() => removeMovie(movie.id)} className={'remove'}>Remove</p>
                                    </Form>
                                </header>
                                <Rating movieId={movie.id} rating={parseInt(movie.rating)}/>
                            </article>
                        ))
                    ) : (
                        <p>No movie found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Films;
