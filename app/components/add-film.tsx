import {useFetcher} from "@remix-run/react";

function AddFilm() {
    const search = useFetcher();

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
        if (value === "") {
            return;
        }
        const formData = new FormData();
        formData.append("formType", "searchFilm");
        formData.append("title", value);
        try {
            search.submit(formData);
        } catch (e) {
            console.log(e);
        }
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
            <h2>CIAO</h2>
            <search.Form action={"/films"} method="GET">
                <input
                    type="text"
                    name="title"
                    id="title"
                    onChange={debouncedSearch}
                    placeholder={"Inception"}
                />
            </search.Form>
            <ul>
                {search.data &&
                    search.data?.searchedMovies?.map((movie) => (
                            <label
                                style={{cursor: "pointer"}}
                                onClick={() => addMovie(movie?.tconst)}
                                key={movie?.tconst}
                            >{movie?.primaryTitle}</label>
                        )
                    )
                }
            </ul>

        </>
    );
}

export default AddFilm;
