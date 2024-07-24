import {Form, Link, redirect, useActionData} from "@remix-run/react";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {prisma} from "~/.server/db";
import {comparePassword} from "~/.server/auth";
import {commitSession, getSession} from "~/session";

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const username_lower = username.toLowerCase();
    const password = formData.get("pass") as string;
    if ((!username_lower && !password) || username_lower === "" || password === "") {
        return json({err: "Error specify all the fields"});
    }

    const user = await prisma.user.findFirst({where: {username: username_lower}});
    if (!user) {
        return json({err: "Error while logging in"});
    }
    const canLogin: boolean = await comparePassword(password, user.password);
    if (canLogin) {
        console.log("LOGGED IN", username_lower);

        const session = await getSession();
        session.set("user", username_lower);

        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }
    return json({err: "Invalid credentials"});
};

function Log_in() {
    const actionData = useActionData<typeof action>();

    return (
        <>
            <div className={"login-container"}>
                <Form className={"form"} method="POST">
                    <label htmlFor={"mail"}>Enter an username</label>
                    <input
                        type="text"
                        id={"username"}
                        name={"username"}
                        placeholder={"your name"}
                        autoComplete={"off"}
                        required
                    />
                    <label htmlFor={"pass"}>Enter a password</label>
                    <input
                        type="password"
                        id={"pass"}
                        name={"pass"}
                        placeholder={"***********"}
                        autoComplete={"off"}
                        required
                    />
                    <p style={{fontSize: 16}}>Don't have an account? <Link to={'/sign_in'}>Register now!</Link></p>
                    <button type="submit">Login</button>
                    <div className="status">{actionData && <p>{actionData.err}</p>}</div>
                </Form>
            </div>
        </>
    );
}

export default Log_in;