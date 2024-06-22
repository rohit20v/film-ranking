import {Form} from "@remix-run/react";

function AddFilm() {

    const fetchFilms = async (event) => {
        const value = event?.target?.value
        const formData = new FormData();
        formData.append('formType', 'searchFilm');
        formData.append('title', value);
        try{
            await fetch('/films',{
                method:'POST',
                body: formData,
            })
        }catch (e){
            console.log(e)
        }
    }
    return (
        <>
            <Form method="post">
                <fieldset role={"group"}>
                    <input type="hidden" name="formType" value="addFilm"/>
                    <input type="text" name="title" id="title" onChange={fetchFilms} placeholder={"Inception"} required/>
                    <input type="submit" value={"Add it!"}/>
                </fieldset>
            </Form>
        </>
    );
}

export default AddFilm;