import {Form, Link, redirect, useActionData} from "@remix-run/react";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {prisma} from "~/.server/db";
import {Prisma} from "@prisma/client";
import {encrypt} from "~/.server/auth";
import {commitSession, getSession} from "~/session";
import fs from "fs";

const DEFAULT_AVATAR_PATH = "./public/default.jpg";
const USER_AVATAR_DIR = "./public/uavatar";

const setDefaultAvatar = (username: string) => {
    try {
        if (!fs.existsSync(USER_AVATAR_DIR)) {
            fs.mkdirSync(USER_AVATAR_DIR, { recursive: true }); // recursive: true ensure that the directory is created
        }

        const userAvatarPath = `${USER_AVATAR_DIR}/${username}.jpg`;
        fs.copyFileSync(DEFAULT_AVATAR_PATH, userAvatarPath);

        console.log(`Default avatar set for user: ${username}`);
    } catch (error) {
        console.error("Error setting default avatar:", error);
    }
};


export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const username_lower = username.toLowerCase();
    const password = formData.get("pass") as string;
    if ((!username_lower && !password) || username_lower === "" || password === "") {
        return json({err: "Error specify all the fields"});
    }

    const hashedPW = await encrypt(password);
    try {
        const createdUser = await prisma.user.create({
            data: {
                username: username_lower,
                password: hashedPW,
            },
        });
        console.log("USER CREATED", createdUser.username);

        setDefaultAvatar(username_lower)
        const session = await getSession();
        session.set("user", username_lower);


        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return json({err: "Error username already taken"});
            }
        }
        console.log("e",e)
        return json({err: "Error creating user"});
    }
};

function Sign_in() {
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
                        autoComplete={"off"}
                        placeholder={"***********"}
                        required
                    />
                    <p style={{fontSize: 16}}>Already have an account? <Link to={'/login'}>Go to login</Link></p>
                    <button type="submit">Sign up</button>
                    <div className="status">{actionData && <p>{actionData.err}</p>}</div>
                </Form>
            </div>
        </>
    );
}

export default Sign_in;
