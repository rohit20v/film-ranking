import {Form, redirect, useLoaderData} from "@remix-run/react";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {prisma} from "~/utils/db.server";
import {User_movie} from "@prisma/client";
import {getSession} from "~/session";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"))
    const sessionUser = session.data.user;
    let showAddFriendButton = true;
    //TODO: check if the user is already friend
    const username = params.username;
    if (!sessionUser || username === sessionUser) {
        showAddFriendButton = false
    }

    const userMovies = await prisma.user.findFirst({where: {username: username}, select: {user_movies: true}});
    if (userMovies === null) {
        return json({error: "User not found"});
    }
    return {username, userMovies, showAddFriendButton}
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
        return json({error: "User not found"});
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
        return json({error: "Error adding friend"});
    }
    return {added: true}
}

const userFilms = () => {
    const data = useLoaderData<{
        username: string,
        userMovies: { user_movies: User_movie[] },
        showAddFriendButton: boolean
    }>();
    const username = data?.username;
    const {user_movies: userMovies} = data.userMovies || {};
    const showAddFriendButton = data?.showAddFriendButton;

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