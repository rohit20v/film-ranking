import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

const MoviePoster = ({ tconst, name }) => {
    const poster = useFetcher();

    useEffect(() => {
        const formData = new FormData();
        formData.append("formType", "moviePoster");
        formData.append("tconst", String(tconst));
        poster.submit(formData, { method: "GET", action: "/films" });
    }, []);

    return (
        <>
            <img alt={name + " poster"} className={"poster"} src={poster?.data?.posterUrl} />
        </>
    );
};
export default MoviePoster;
