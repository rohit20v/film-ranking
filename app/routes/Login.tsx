import { PrismaClient } from '@prisma/client';
import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from '@remix-run/node';
import React from 'react';
import {Form} from "@remix-run/react";

const prisma = new PrismaClient()

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//     const user = await prisma.user.create({
//         data: {
//             email: 'alice@prisma.io',
//             password:
//         },
//     })
//     console.log(user)
//     return json({ user});
// }
export const action = async ({ params, request }: ActionFunctionArgs) => {
    console.log(params)
    const formData = await request.formData()
    console.log(formData)
    console.log(formData.get("email"))
    return redirect("/add-film")
}


function Login() {
    return (
        <div>
            <Form id={"login"} method="post">
                <input type="email" name="email" id="email" required/>
                <input type="password" name="pass" id="pass" required/>
                <button type="submit" >Add user</button>
            </Form>
        </div>
    );
}

export default Login;