import {json, LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {prisma} from "~/.server/db";
import {OnlyStar} from "~/components/Star";

export const loader = async ({request}: LoaderFunctionArgs) => {
    try {
        const filmsRatings = await prisma.user_movie.groupBy({
            by: ['tconst', 'title'],
            _avg: {
                rating: true,
            },
            orderBy: {_avg: {rating: "desc"}},
            take: 5,
        })
        const ratings = filmsRatings.map(({tconst, title, _avg}) => {
            return {tconst, title, rating: Number(_avg?.rating ?? "0")}
        })
        return json({movies: ratings});
    } catch (e) {
        return json({movies: null})
    }
};

export default function Index() {
    const {movies} = useLoaderData<typeof loader>();
    return (
        <>
            <div className={"center"}>
                <strong>Top rated movies</strong>
                <ul className={"homeContainer"}>
                    {
                        movies?.map(({tconst, title, rating}) => {
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
