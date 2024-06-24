import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, Link, redirect, useLoaderData} from "@remix-run/react";
import {prisma} from "~/utils/db.server";
import {getSession} from "~/session";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"))
    const username = session.data.user;
    if (!username) { //verify if the user is logged
        return redirect("/login");
    }

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
    const session = await getSession(request.headers.get("cookie"))
    const user = session.data.user;
    if (!user) { //verify if the user is logged
        return redirect("/login");
    }

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