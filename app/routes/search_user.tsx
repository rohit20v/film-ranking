import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, Link, redirect, useLoaderData} from "@remix-run/react";
import {prisma} from "~/.server/db";
import {checkLogin} from "~/.server/auth";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const username = await checkLogin(request)
    try {
        const friends = await prisma.user_friends.findMany({
            include: {
                friend: {select: {username: true}},
            },
            where: {user: {username: username}}
        })
        return json({err: null, friends})
    } catch (e) {
        return json({err: "Can't find user", friends: null})
    }
}

export const action = async ({request}: ActionFunctionArgs) => {
    await checkLogin(request)
    const formData = await request.formData();
    const formUsername: string = formData.get("username") as string;
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
    const data = useLoaderData<typeof loader>()
    const friends = data?.friends ?? [];

    return (
        <>
            <Form method={"POST"}>
                <fieldset role={"group"}>
                    <input type={"text"} name={"username"} placeholder={"Search your friends!"}/>
                    <input type={"submit"} value={"Search user"} />
                </fieldset>
            </Form>
            <h4>Friends list:</h4>
            <ul>
                {friends?.map((x) => (
                    <li key={x?.friend?.username}>
                        <Link to={"/user/" + x?.friend.username}>{x?.friend?.username}</Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Search_user;