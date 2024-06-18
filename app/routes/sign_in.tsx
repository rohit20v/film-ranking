import {Form, redirect, useActionData} from "@remix-run/react";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {prisma} from "~/utils/db.server";
import {Prisma} from "@prisma/client";
import {encrypt} from "~/.server/auth";

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData()
    const username = formData.get("username") as string
    const username_lower = username.toLowerCase()
    const password = formData.get("pass") as string
    if ((!username_lower && !password) || (username_lower === "" || password === "")) {
        return json({err: "Error specify all the fields"})
    }

    const hashedPW = await encrypt(password)
    try {
        const createdUser = await prisma.user.create({
            data: {
                username: username_lower,
                password: hashedPW,
            }
        })
        console.log("USER CREATED", createdUser.username)
        return redirect("/")
    } catch (Error) {
        if (Error instanceof Prisma.PrismaClientKnownRequestError) {
            if (Error.code === "P2002") {
                return json({err: "Error username already taken"})
            }
        }
        return json({err: "Error creating user"})
    }
}

function Sign_in() {
    const actionData = useActionData<typeof  action>()
    return (
        <>
            <h1>Sign In</h1>
            <div className={"login-container"}>
                <Form className={"form"} method="POST">
                    <label htmlFor={"mail"}>Enter an username</label>
                    <input type="text" id={"username"} name={"username"} placeholder={"your name"} required/>
                    <label htmlFor={"pass"}>Enter a password</label>
                    <input type="password" id={"pass"} name={"pass"} placeholder={"***********"} required/>
                    <button type="submit">Login</button>
                    <div className="status">
                        {actionData && <p >{actionData.err}</p>}
                    </div>
                </Form>
            </div>
        </>
    );
}

export default Sign_in;