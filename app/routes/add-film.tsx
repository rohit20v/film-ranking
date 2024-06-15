import {ActionFunctionArgs, json, redirect} from '@remix-run/node';
import React from 'react';
import {Form} from "@remix-run/react";
import {prisma} from "~/utils/db.server";

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const desc = formData.get("desc") as string
    try {
        const movie = await prisma.movie.create({
            data: {
                name: title,
                description: desc,
            }
        })
        console.log("done")
        return redirect("/films")
    } catch (er) {
        console.log("not done")
        return json({err: "Error adding movie"})
    }
}


function AddFilm() {
    return (
        <div>
            <Form id={"login"} method="post">
                <label htmlFor="title">Movie Title</label>
                <input type="text" name="title" id="title" placeholder={"Inception"} required/>
                <label htmlFor="desc">Movie desc</label>
                <textarea name="desc" id="desc" placeholder={"Add movie description here.."} required/>
                <button type="submit">Add it!</button>
            </Form>
        </div>
    );
}

export default AddFilm;