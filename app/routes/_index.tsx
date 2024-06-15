import type {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        {title: "FilmI"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export default function Index() {
    return (
        <div className="font-sans p-4">
            <h1 className="text-3xl font-tohama">WE WASH MOVIES</h1>
        </div>
    );
}
