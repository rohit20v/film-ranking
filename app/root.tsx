import {Links, Meta, Outlet, Scripts, ScrollRestoration,} from "@remix-run/react";
import {MantineProvider} from "@mantine/core";
import "./tailwind.css";
import "./index.css";
import '@mantine/core/styles.css';
import Navbar from "~/components/Navbar";

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Navbar />
        <MantineProvider defaultColorScheme={"dark"}>
            {children}
        </MantineProvider>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet/>;
}
