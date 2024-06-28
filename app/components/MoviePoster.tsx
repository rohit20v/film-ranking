import {useFetcher} from "@remix-run/react";
import {useEffect} from "react";

const MoviePoster = ({tconst, name}) => {
    const poster = useFetcher();

    useEffect(() => {
        const formData = new FormData();
        formData.append("formType", "moviePoster");
        formData.append("tconst", String(tconst));
        poster.submit(formData, {method: "GET", action: "/films"});
    }, []);

    return (
        <>
            {!poster?.data?.posterUrl ?
                (<div aria-busy={true}></div>)
                :
                (<img alt={name + " poster"} src={poster?.data?.posterUrl} className={"poster"}/>)
            }
        </>
    );
};
export default MoviePoster;
