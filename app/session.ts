import { createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "session",
        secrets: [process.env.SECRET_KEY as string],

        path: "/",
        maxAge: 60 * 60 * 24,
    },
});
