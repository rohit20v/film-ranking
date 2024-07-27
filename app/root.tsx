import {Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData} from "@remix-run/react";
import "./styles/index.css";
import Navbar from "~/components/Navbar";
import {Footer} from "~/components/Footer";
import {getUserFromCookies} from "~/.server/auth";
import {LoaderFunctionArgs} from "@remix-run/node";

export const links = () => [
    {rel: "stylesheet", href: "/pico.blue.min.css"}
];
export const loader = async ({request}: LoaderFunctionArgs) => {
    const user = await getUserFromCookies(request)
    return {user: user}
}

export function Layout({children}: { children: React.ReactNode }) {
    const data= useLoaderData<typeof loader>()
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>FilmI</title>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Navbar user={data?.user}/>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        <footer>
            <hr/>
            <Footer/>
        </footer>
        </body>
        </html>
    );
}

export default function App() {
    return (
        <div className="container-fluid overflow-auto">
            <Outlet/>
        </div>
    );
}
