import {LoaderFunctionArgs} from "@remix-run/node"
import fs from "fs";

const isGif = async (username: string): Promise<boolean> => {
    let error = new Promise<boolean>((resolve, reject) => {
        fs.stat("./public/uavatar/" + username + ".gif", (err, stats) => {
            resolve(err === null)
        });
    })
    return await error
}

export async function loader({request, params}: LoaderFunctionArgs) {
    const userParam = params.user ?? ""
    if (await isGif(userParam)) {
        const url = new URL(request.url);
        url.pathname = "/uavatar/" + userParam + ".gif";
        const imageBuffer = await fetch(url).then(
            (res) => res.body,
        )
        return new Response(imageBuffer, {
            headers: {
                "Content-Type": "image/gif",
                "Cache-Control": "no-cache",
            },
        })
    } else {
        const url = new URL(request.url);
        url.pathname = "/uavatar/" + userParam + ".jpg";
        const imageBuffer = await fetch(url).then(
            (res) => res.body,
        )
        return new Response(imageBuffer, {
            headers: {
                "Content-Type": "image/jpeg",
                "Cache-Control": "no-cache",
            },
        })
    }
}
