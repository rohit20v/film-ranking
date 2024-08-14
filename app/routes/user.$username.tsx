import {Form, useLoaderData} from "@remix-run/react";
import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {prisma} from "~/.server/db";
import {OnlyStar} from "~/components/Star";
import MoviePoster from "~/components/MoviePoster";
import {checkLogin} from "~/.server/auth";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const sessionUser = await checkLogin(request)

    const getLoggedUserId = await prisma.user.findFirst({
        where: {
            username: sessionUser
        },
        select: {id: true}
    });

    let showAddFriendButton = true;
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
            userId: null,
            username: null,
            userMovies: null,
            showAddFriendButton: null,
        });
    }

    return json({err: null, userId: getLoggedUserId, username: userSearched, userMovies, showAddFriendButton});
};

export const action = async ({request, params}: ActionFunctionArgs) => {
    const user = await checkLogin(request);
    const formData = await request.formData()
    const formType = formData.get("action");

    const user_id = Number(formData.get("userId"));
    const tconst = String(formData.get("tconst"));

    if (formType === 'like') {
        const existingLike = await prisma.like.findFirst({
            where: {
                user_id: user_id,
                movie: {
                    tconst: tconst,
                },
            },
        });

        if (!existingLike) {
            const movieRecord = await prisma.user_movie.findFirst({
                where: {
                    tconst,
                },
                select: { id: true },
            });

            if (movieRecord) {
                await prisma.like.create({
                    data: {
                        user_id: user_id,
                        movie_id: movieRecord.id,
                    },
                });
            }
        }
    } else if (formType === 'dislike') {
        await prisma.like.deleteMany({
            where: {
                user_id: user_id,
                movie: {
                    tconst: tconst,
                },
            },
        });
    }

    const friendToAdd = params.username;
    const friendToAddId = await prisma.user.findFirst({
        where: {username: friendToAdd},
        select: {id: true},
    });
    if (!friendToAddId?.id) {
        return json({err: "User not found"});
    }
    try {
        await prisma.user.update({
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
    const loggedUserId = data?.userId?.id as number;
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

                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <div className={'avatar-container'}>
                            <img alt={username} className={'avatar'} src={"/avatar/" + username}/>
                        </div>
                        <span style={{marginLeft: "16px", marginBottom: "8px", fontWeight: "bold", fontSize: 42}}>
                            <span className={'friendName'}>
                                {username}
                            </span>
                        </span>
                    </div>
                    {userMovies?.length > 0 ? (

                        <div className={'friendMovies'}>
                            {userMovies?.map((movie) => (
                                <article style={{textAlign: "center"}} title={movie.title}
                                         key={movie.id}>
                                    <header>
                                        <strong className="movieName">{movie.title}</strong>
                                    </header>
                                    <div>
                                        <MoviePoster isLikable={true} name={movie.title} tconst={movie.tconst}
                                                     username={username} userId={Number(loggedUserId)}/>
                                    </div>
                                    <footer>
                                        <OnlyStar star={parseInt(movie.rating)}/>
                                    </footer>
                                </article>

                            ))}
                        </div>

                    ) : (
                        <p>No movie found</p>
                    )}
                </>
            )}
        </>
    );
};
export default UserFilms;
