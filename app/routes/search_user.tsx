import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {Form, Link, redirect, useFetcher, useLoaderData} from "@remix-run/react";
import {prisma} from "~/.server/db";
import {checkLogin} from "~/.server/auth";
import {MdPersonRemove} from "react-icons/md";
import {removeFriend} from "~/.server/functions";

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
    const formType = formData.get("formType");

    if (formType === 'removeFriend') {
        return await removeFriend(formData);
    } else {
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
}

const Search_user = () => {
    const data = useLoaderData<typeof loader>()
    const fetcher = useFetcher()
    const friends = data?.friends ?? [];

    const removeFriend = async (friendToRemove: string, currentUser: string) => {
        const formData = new FormData()
        formData.append("formType", 'removeFriend')
        formData.append("friendToRemove", friendToRemove)
        formData.append("currentUser", currentUser)
        fetcher.submit(formData, {method: "post"});
    };
    return (
        <>
            <Form role={"search"} method={"POST"}>
                <fieldset role={"group"}>
                    <input type={"text"} name={"username"} placeholder={"Search your friends!"}/>
                    <input type={"submit"} value={"Search user"}/>
                </fieldset>
            </Form>
            <span style={{margin: 16, fontSize: "x-large"}}>Friends list:</span>
            <ul style={{marginInline: 32, paddingBlock: 16, overflowY: "scroll"}}>
                {friends?.map((x) => (
                    <li key={x?.friend?.username}>
                        <div style={{display: "flex", gap: 16, alignItems: "center"}}>
                            <span>☼</span>
                            <div style={{width: "16%", display: "flex", justifyContent: "space-between"}}>
                                <Link style={{textDecoration: "none"}}
                                      to={"/user/" + x?.friend.username}>{x?.friend?.username}</Link>
                                <MdPersonRemove cursor={"pointer"}
                                                onClick={() => removeFriend(String(x?.friend_id), String(x?.user_id))}
                                                size={32}
                                                color={'#da0000'}/>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Search_user;