import { prisma } from "~/utils/db.server";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MOVIE } from "~/types/movie-table";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const movies = await prisma.movie.findMany();
    console.log("DB has:", movies.length, "movies");
    return json({ movies });
  } catch (err) {
    console.log("Error fetching data from DB");
    return json({ err: "Error fetching data from DB" });
  }
};

function Films() {
  const { movies } = useLoaderData<{ movies: MOVIE[] }>();
  return (
    <div className="text-center">
      {movies ? (
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
