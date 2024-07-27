import bcrypt from 'bcrypt';
import {getSession} from "~/session";
import {redirect} from "@remix-run/react";
import {prisma} from "~/.server/db";

export const encrypt = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (inputPassword: string, storedEncryptedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(inputPassword, storedEncryptedPassword);
}

export const getUserFromCookies = async (request: Request): Promise<string> => {
    const session = await getSession(request.headers.get("cookie"));
    return session.data.user;
}

export const checkLogin = async (request: Request): Promise<string> => {
    const cookieUser = await getUserFromCookies(request);
    if (!cookieUser) {
        //verify if the user has cookie
        throw redirect("/login")
    }
    try {
        const user = await prisma.user.findFirst({
            where: {username: cookieUser},
            select: {username: true}
        })
        if (!user) {
            //verify if the user exists in the db
            throw redirect("/login")
        }
        return user.username
    } catch (e) {
        throw redirect("/login")
    }
}