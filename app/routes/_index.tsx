import {json, LoaderFunctionArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/session";
import { prisma } from "~/utils/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("cookie"));

    if (session.data.user) {
        const canLogin = await prisma.user.findUnique({
            select: {
                username: true,
            },
            where: {
                username: session.data.user,
            },
        });
        if (canLogin){
            return json({user: session.data, err: null});
        }
    }
    return json({user: null, err: "No session found"});
};

export default function Index() {
    const {user} = useLoaderData<typeof loader>();
    return (
        <>
            <div className={"center"}>
                {user ? (<p>Ben tornato: {user?.user}</p>) : (<p>Non hai effettuato l'accesso</p>)}
            </div>
        </>
    );
}
