import {ActionFunctionArgs, json} from "@remix-run/node";
import {Form, redirect} from "@remix-run/react";
import {prisma} from "~/utils/db.server";

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const formUsername: string = formData.get("username");
    if (!formUsername) {
        return json({err: "Error no username to search"});
    }
    const usernameToSearch = formUsername?.toLowerCase();
    const user = await prisma.user.findFirst({
        where: {username: usernameToSearch},
        select: {username: true}
    })
    if (user) {
        return redirect("/user_films/" + usernameToSearch);
    }
    return json({err: "Error user not found"})
}

const Search_user = () => {
    return (
        <>
            <Form method={"POST"}>
                <input type={"text"} name={"username"} placeholder={"Search your friends!"}/>
                <button type={"submit"}>Search user</button>
            </Form>
        </>
    )
}

export default Search_user;