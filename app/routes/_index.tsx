import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/session";
import { prisma } from "~/utils/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    let session = await getSession(request.headers.get("cookie"));

    if (session.data.user) {
        const canLogin = await prisma.user.findUnique({
            select: {
                username: true,
            },
            where: {
                username: session.data.user,
            },
        });
        return session.data;
    }

    return null;
};

export default function Index() {
    const user: { user: string } = useLoaderData();

    return (
        <>
            <div className={"center"}>
                <span className={"title"}>CINEPHILIA!!</span>
            </div>
            <div>
                {user ? <h3>Ben tornato: {user?.user}</h3> : <p>Non hai effettuato l'accesso</p>}
            </div>
        </>
    );
}
