import {prisma} from "~/utils/db.server";
import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {MOVIE} from "~/types/movie-table";


export const loader = async ({params}: LoaderFunctionArgs) => {
    try {
        const movies = await prisma.movie.findMany();
        console.log("DB has:", movies.length, "movies")
        return json({movies})
    } catch (err) {
        console.log("Error fetching data from DB")
        return json({err: "Error fetching data from DB"})
    }
}

function Films() {
    const {movies} = useLoaderData<{ movies:MOVIE[] }>();
    return (
        <div className="text-center">
            {movies ?
                <ul>
                    {movies?.map((movie) => (
                        <li key={movie?.id}><strong className={"movieName"}>{movie?.name}:</strong> <span style={{fontWeight: 400}}>{movie?.description}</span> </li>
                    ))}
                </ul>
                :
                <button>No movie found</button>
            }
        </div>
    );
}

export default Films;