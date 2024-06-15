import type {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        {title: "FilmI"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export default function Index() {
    return (
        <div>
            <h1>WE WASH MOVIES</h1>
        </div>
    );
}
