import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, redirect, useLoaderData} from "@remix-run/react";
import {prisma} from "~/utils/db.server";
import {getSession} from "~/session";
import {User_friends} from "@prisma/client";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"))
    const username = session.data.user;
    if (!username) { //verify if the user is logged
        return redirect("/login");
    }

    const friends = await prisma.user.findFirst({
        select: {user_friends: true},
        where: {username: username}
    });
    return friends
}

export const action = async ({request}: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"))
    const user = session.data.user;
    if (!user) { //verify if the user is logged
        return redirect("/login");
    }

    const formData = await request.formData();
    const formUsername: string = formData.get("username");
    if (!formUsername) {
        return json({err: "Error no username to search"});
    }
    const usernameToSearch = formUsername?.toLowerCase();
    const userSearched = await prisma.user.findFirst({
        where: {username: usernameToSearch},
        select: {username: true}
    })
    if (userSearched) {
        return redirect("/user/" + usernameToSearch);
    }
    return json({err: "Error user not found"})
}

const Search_user = () => {
    const data = useLoaderData<User_friends[]>()
    const friends = data?.user_friends;
    console.log(friends)
    return (
        <>
            <Form method={"POST"}>
                <input type={"text"} name={"username"} placeholder={"Search your friends!"}/>
                <button type={"submit"}>Search user</button>
            </Form>
            {friends?.map((x) => (
                <p key={x}>x</p>
            ))}
        </>
    )
}

export default Search_user;