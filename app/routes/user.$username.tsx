import {Form, redirect, useLoaderData} from "@remix-run/react";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {prisma} from "~/utils/db.server";
import {getSession} from "~/session";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"))
    const sessionUser = session.data.user;
    let showAddFriendButton = true;
    //TODO: remove fried
    const username = params.username;
    if (!sessionUser || username === sessionUser/*searched user is the same logged in*/) {
        showAddFriendButton = false
    }
    const userFriends = await prisma.user.findFirst({
        where: {
            username: sessionUser
        },
        select: {
            user_friends: {include: {friend: {select: {username: true}}}}
        }
    })
    const sessionUserFriends = userFriends?.user_friends.map((x)=>x.friend.username)
    if (sessionUserFriends?.includes(username)){
        showAddFriendButton = false
    }
    const userMovies = await prisma.user.findFirst({
        where: {username: username},
        select: {user_movies: true}
    });
    if (userMovies === null) {
        return json({err: "User not found", username: null, userMovies: null, showAddFriendButton: null});
    }
    return json({err: null, username, userMovies, showAddFriendButton})
}

export const action = async ({request, params}: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"))
    const user = session.data.user;
    if (!user) { //verify if the user is logged
        return redirect("/login");
    }
    const friendToAdd = params.username
    const friendToAddId = await prisma.user.findFirst({where: {username: friendToAdd}, select: {id: true}});
    if (!friendToAddId?.id) {
        return json({err: "User not found"});
    }
    try {
        const added = await prisma.user.update({
            where: {
                username: user,
            },
            data: {
                user_friends: {create: {friend_id: friendToAddId.id}}
            }
        })
    } catch (e) {
        return json({err: "Error adding friend"});
    }
    return json({err: null})
}

const userFilms = () => {
    const data = useLoaderData<typeof loader>();

    const username = data?.username ?? "";
    const userMovies = data?.userMovies?.user_movies || [];
    const showAddFriendButton = data?.showAddFriendButton || false;

    return (
        <>
            {!data?.username ?
                (<p>user not found</p>) :
                (
                    <>
                        <h1> {username}</h1>
                        {showAddFriendButton &&
                            <Form method={"POST"}>
                                <button type={"submit"}>Add friend</button>
                            </Form>
                        }
                    </>
                )
            }
            {
                userMovies?.length > 0 ? (
                    <>
                        {userMovies?.map((movie) => (
                            <article title={movie?.name} key={movie?.id}>
                                <header>
                                    <strong className={"movieName"}>{movie?.name}</strong>
                                </header>
                            </article>
                        ))}
                    </>
                ) : (
                    <p>No movie found</p>
                )
            }
        </>
    )
}
export default userFilms