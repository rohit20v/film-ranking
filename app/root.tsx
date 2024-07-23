import {Links, Meta, Outlet, Scripts, ScrollRestoration,} from "@remix-run/react";
import "./styles/index.css";
import Navbar from "~/components/Navbar";


export const links = () => [
    {rel: "stylesheet", href: "/pico.blue.min.css"}
];

export function Layout({children}: { children: React.ReactNode }) {
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
        <Navbar/>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return (
        <div className={"container-fluid overflow-auto"}>

            <Outlet/>
        </div>)
}
