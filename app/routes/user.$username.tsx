import {Form, useLoaderData} from "@remix-run/react";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {prisma} from "~/.server/db";
import {OnlyStar} from "~/components/Star";
import MoviePoster from "~/components/MoviePoster";
import {checkLogin} from "~/.server/auth";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const sessionUser = await checkLogin(request)

    let showAddFriendButton = true;
    //TODO: remove friend
    const userSearched = params.username;
    if (
        !sessionUser ||
        userSearched === sessionUser /*searched user is the same logged in*/
    ) {
        showAddFriendButton = false;
    }
    const userFriends = await prisma.user.findFirst({
        where: {
            username: sessionUser,
        },
        select: {
            following: {include: {friend: {select: {username: true}}}},
        },
    });
    const sessionUserFriends = userFriends?.following.map(
        (x) => x.friend.username,
    );
    if (sessionUserFriends?.includes(userSearched)) {
        showAddFriendButton = false;
    }
    const userMovies = await prisma.user.findFirst({
        where: {username: userSearched},
        select: {user_movies: true},
    });
    if (userMovies === null) {
        return json({
            err: "User not found",
            username: null,
            userMovies: null,
            showAddFriendButton: null,
        });
    }

    return json({err: null, username: userSearched, userMovies, showAddFriendButton});
};

export const action = async ({request, params}: ActionFunctionArgs) => {
    const user = await checkLogin(request);

    const friendToAdd = params.username;
    const friendToAddId = await prisma.user.findFirst({
        where: {username: friendToAdd},
        select: {id: true},
    });
    if (!friendToAddId?.id) {
        return json({err: "User not found"});
    }
    try {
        const added = await prisma.user.update({
            where: {
                username: user,
            },
            data: {
                following: {create: {friend_id: friendToAddId.id}},
            },
        });
    } catch (e) {
        return json({err: "Error adding friend"});
    }
    return json({err: null});
};

const UserFilms = () => {
    const data = useLoaderData<typeof loader>();

    const username = data?.username ?? "";
    const userMovies = data?.userMovies?.user_movies || [];
    const showAddFriendButton = data?.showAddFriendButton || false;

    return (
        <>
            {!data?.username ? (
                <p>user not found</p>
            ) : (
                <>
                    {showAddFriendButton && (
                        <Form method={"POST"}>
                            <button type={"submit"}>Add friend</button>
                        </Form>
                    )}
                    <span style={{fontWeight: "bold", fontSize: 42}}> {username}</span>
                    {userMovies?.length > 0 ? (
                        <>
                            {userMovies?.map((movie) => (
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <article style={{maxWidth: "420px", textAlign: "center"}} title={movie.title}
                                             key={movie.id}>
                                        <header>
                                            <strong className="movieName">{movie.title}</strong>
                                        </header>
                                        <MoviePoster name={movie.title} tconst={movie.tconst}/>
                                        <footer>

                                            <OnlyStar star={parseInt(movie.rating)}/>
                                        </footer>
                                    </article>
                                </div>

                            ))}
                        </>
                    ) : (
                        <p>No movie found</p>
                    )}
                </>
            )}
        </>
    );
};
export default UserFilms;
