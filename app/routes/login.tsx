import { Form, redirect, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { comparePassword } from "~/.server/auth";
import { getSession, commitSession } from "~/session";

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const username_lower = username.toLowerCase();
    const password = formData.get("pass") as string;
    if ((!username_lower && !password) || username_lower === "" || password === "") {
        return json({ err: "Error specify all the fields" });
    }

    const user = await prisma.user.findFirst({ where: { username: username_lower } });
    if (!user) {
        return json({ err: "Error while logging in" });
    }
    const canLogin: boolean = await comparePassword(password, user.password);
    if (canLogin) {
        console.log("LOGGED IN", username);

        let session = await getSession();
        session.set("user", username);

        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }
    return json({ err: "Invalid credentials" });
};

function Log_in() {
    const actionData = useActionData<typeof action>();

    return (
        <>
            <h1>Login</h1>
            <div className={"login-container"}>
                <Form className={"form"} method="POST">
                    <label htmlFor={"mail"}>Enter an username</label>
                    <input
                        type="text"
                        id={"username"}
                        name={"username"}
                        placeholder={"your name"}
                        required
                    />
                    <label htmlFor={"pass"}>Enter a password</label>
                    <input
                        type="password"
                        id={"pass"}
                        name={"pass"}
                        placeholder={"***********"}
                        required
                    />
                    <button type="submit">Login</button>
                    <div className="status">{actionData && <p>{actionData.err}</p>}</div>
                </Form>
            </div>
        </>
    );
}

export default Log_in;
