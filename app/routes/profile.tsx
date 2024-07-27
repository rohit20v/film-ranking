import {
    unstable_createFileUploadHandler,
    unstable_parseMultipartFormData,
    json,
    LoaderFunctionArgs,
    ActionFunctionArgs
} from "@remix-run/node";
import fs from "fs";
import {checkLogin} from "~/.server/auth";
import {useLoaderData} from "@remix-run/react";
import UserCard from "~/components/UserCard";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const username = await checkLogin(request);
    return json({avatar: "/avatar/" + username, username}, {headers: {'Cache-Control': 'no-cache'}});
}

export const action = async ({request}: ActionFunctionArgs) => {
    const username = await checkLogin(request);

    const fileUp = unstable_createFileUploadHandler();
    const formDataFile = await unstable_parseMultipartFormData(request, fileUp);
    const uploaded = formDataFile.get("filename")

    if (!uploaded) {
        return json({err: "Upload failed."})
    }
    if (uploaded.type !== "image/jpeg") {
        return json({err: "Image extension must be .jpeg or .jpg"})
    }

    if (!fs.existsSync("./public/uavatar")) {
        fs.mkdirSync("./public/uavatar");
    }
    fs.copyFile(uploaded.filepath, './public/uavatar/' + username + ".jpg", (err) => {
        if (err) throw err;
        console.log(username, "uploaded avatar");
    });
    return json({err: "Upload Done"}, {headers: {"Cache-Control": "no-cache"}});
}

const FileUpload = () => {
    const {avatar, username } = useLoaderData<typeof loader>()
    return (
        <>
            <UserCard src={avatar} username={username} />
        </>
    )
}
export default FileUpload;