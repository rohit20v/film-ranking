import { LoaderFunctionArgs } from "@remix-run/node"
export async function loader({ request,params }: LoaderFunctionArgs) {

    const url = new URL(request.url)
    url.pathname = "/uavatar/"+ params.user+".jpg";
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
