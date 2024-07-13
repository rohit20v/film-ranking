import {getSession} from "~/session";
import {redirect} from "@remix-run/react";
import {prisma} from "~/utils/db.server";

export const checkLogin = async (request: Request): Promise<string> => {
    const session = await getSession(request.headers.get("cookie"));
    const cookieUser = session.data.user;
    if (!cookieUser) {
        //verify if the user has cookie
        throw redirect("/login")
    }
    const user = await prisma.user.findFirst({
        where: {username: cookieUser},
        select: {username: true}
    })
    if (!user) {
        //verify if the user exists in the db
        throw redirect("/login")
    }
    console.log("logged", user.username)
    return user.username
}