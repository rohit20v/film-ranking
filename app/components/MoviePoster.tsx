import {FetcherWithComponents, useFetcher} from "@remix-run/react";
import {useEffect, useState} from "react";

const MoviePoster = ({tconst, name, isLikable = false, username, userId, likedMovies = []}:
                         {
                             tconst: string,
                             name: string,
                             isLikable?: boolean,
                             username?: string,
                             userId?: number,
                             likedMovies?: string[]
                         }) => {
    const poster: FetcherWithComponents<{ posterUrl: string }> = useFetcher();
    const [isLiked, setIsLiked] = useState(likedMovies.includes(tconst));
    const fetcher = useFetcher();

    useEffect(() => {
        const formData = new FormData();
        formData.append("formType", "moviePoster");
        formData.append("tconst", String(tconst));
        poster.submit(formData, {method: "GET", action: "/films"});
    }, []);

    const handleLikes = () => {
        if (isLikable) {
            const toBeToggled = !isLiked;
            setIsLiked(!isLiked);
            const formData = new FormData();
            formData.append('action', toBeToggled ? 'like' : 'dislike');
            formData.append('userId', String(userId));
            formData.append('tconst', String(tconst));

            fetcher.submit(formData, {
                method: 'POST',
                action: `/user/${username}`,
            });
        }
    };

    return (
        <>
            {!poster?.data?.posterUrl ? (
                <div aria-busy={true}></div>
            ) : (
                <div style={{position: 'relative'}}>
                    <img
                        alt={`${name} poster`}
                        src={poster?.data?.posterUrl}
                        className={`poster ${isLiked ? 'liked' : ''}`}
                        onDoubleClick={handleLikes}
                    />
                    {isLikable && isLiked && (
                        <div className="like-indicator">❤️</div>
                    )}
                </div>
            )}
        </>
    );
};

export default MoviePoster;
