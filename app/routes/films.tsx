import {prisma} from "~/utils/db.server";
import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";


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
    const {movies} = useLoaderData<{ movies }>();
    return (
        <div className="text-center">
            {movies ?
                <ul>
                    {movies?.map((movie) => (
                        <li>{movie?.name}</li>
                    ))}
                </ul>
                :
                <button>No movie found</button>
            }
        </div>
    );
}

export default Films;