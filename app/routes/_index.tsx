import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {prisma} from "~/utils/db.server";
import {OnlyStar} from "~/components/Star";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const filmsRatings = await prisma.user_movie.groupBy({
        by: ['tconst', 'title'],
        _avg: {
            rating: true,
        }
    })
    const ratings = filmsRatings.map(({tconst, title, _avg}) => {
//        const rating = parseInt(_avg?.rating??"0")
        return {tconst, title, rating: Number(_avg?.rating ?? "0")}
    })
    return json({movies: ratings, err: "No session found"});
};

export default function Index() {
    const {movies} = useLoaderData<typeof loader>();
    return (
        <>
            <div className={"center"}>
                <ul >
                    {
                        movies.map(({tconst,title, rating}) => {
                            return (
                                <li key={tconst} style={{listStyleType: "none"}}>
                                    <article>
                                        <header>{title}</header>
                                        <OnlyStar star={rating}/>
                                    </article>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    );
}
