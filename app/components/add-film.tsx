import {FetcherWithComponents, useFetcher} from "@remix-run/react";

import {searchedMovie} from "~/.server/functions";


function AddFilm() {
    const search: FetcherWithComponents<{ searchedMovies: searchedMovie[] }> = useFetcher();
    const addMovie = async (tconst: string) => {
        if (!tconst) {
            return;
        }
        const formData = new FormData();
        formData.append("formType", "addFilm");
        formData.append("tconst", tconst);
        try {
            search.submit(formData, {method: "POST"});
        } catch (e) {
            console.log(e);
        }
    };
    const searchFilm = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event?.target?.value;
        const formData = new FormData();
        formData.append("formType", "searchFilm");
        formData.append("title", value);

        search.submit(formData);
    };

    function debounce<T extends (...args: any[]) => any>(cb: T, wait: number = 400) {
        let h: any;
        const callable = (...args: any) => {
            clearTimeout(h);
            h = setTimeout(() => cb(...args), wait);
        };
        return callable;
    }

    const debouncedSearch = debounce(searchFilm);

    return (
        <>
            <h2>
                <span>Hey! <span style={{fontSize: "xx-large"}}></span></span>
            </h2>
            <search.Form action={"/films"} method="GET">
                <input
                    type="text"
                    name="title"
                    id="title"
                    onChange={debouncedSearch}
                    placeholder={"Inception"}
                    autoComplete={"off"}
                />
                {search.state === "loading" && (
                    <div aria-busy="true"/>
                )}
                {search.data?.searchedMovies?.length === 0 && (
                    <div className="suggestedMovies">No movies found.</div>
                )}
            </search.Form>
            <ul className={'movie-list'}>
                {search.data &&
                    search.data?.searchedMovies?.map((movie) => (
                            <li className={'suggestedMovies'}
                                onClick={() => addMovie(movie?.tconst)}
                                key={movie?.tconst}
                            >{movie?.primaryTitle}</li>
                        )
                    )
                }
            </ul>

        </>
    );
}

export default AddFilm;
