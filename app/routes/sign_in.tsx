import {Form, redirect} from "@remix-run/react";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {prisma} from "~/utils/db.server";
import {Prisma} from "@prisma/client";

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData()
    const username = formData.get("username") as string
    const username_lower = username.toLowerCase()
    const password = formData.get("pass") as string
    try {
        const createdUser = await prisma.user.create({
            data: {
                username: username_lower,
                password: password,
            }
        })
        console.log("USER CREATED", createdUser)
        return redirect("/")
    } catch (Error) {
        if (Error instanceof Prisma.PrismaClientKnownRequestError) {
            if (Error.code === "P2002"){
                return json({err: "Error username already taken"})
            }
        }
        return json({err: "Error creating user"})
    }
}

function Sign_in() {
    return (
        <div className={"login-container"}>
            <Form className={"form"} method="POST">
                <label htmlFor={"mail"}>Enter an username</label>
                <input type="text" id={"username"} name={"username"} placeholder={"your name"} required/>
                <label htmlFor={"pass"}>Enter a password</label>
                <input type="password" id={"pass"} name={"pass"} placeholder={"***********"} required/>
                <button type="submit">Login</button>
            </Form>
        </div>
    );
}

export default Sign_in;