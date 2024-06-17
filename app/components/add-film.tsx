import {Form} from "@remix-run/react";

function AddFilm() {

    return (
        <>
            <Form method="post">
                <fieldset role={"group"}>
                    <input type="text" name="title" id="title" placeholder={"Inception"} required/>
                    <input type="submit" value="Add it!"/>
                </fieldset>
            </Form>
        </>
    );
}

export default AddFilm;