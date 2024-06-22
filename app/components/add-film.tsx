import {Form} from "@remix-run/react";

function AddFilm() {
    // const fetcher = useFetcher();
    // const isSubmitting= fetcher.state !== "idle";

    // let inp = useRef()
    // useEffect(() => {
    //
    // })
    return (
        <>
            <Form method="post">
                <fieldset role={"group"}>
                    <input type="hidden" name="formType" value="addFilm"/>
                    <input type="text" name="title" id="title" placeholder={"Inception"} required/>
                    <input type="submit" value={"Add it!"}/>

                </fieldset>
            </Form>
        </>
    );
}

export default AddFilm;