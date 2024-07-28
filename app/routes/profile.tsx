import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    unstable_createFileUploadHandler,
    unstable_parseMultipartFormData
} from "@remix-run/node";
import fs from "fs";
import {checkLogin} from "~/.server/auth";
import {useLoaderData} from "@remix-run/react";
import UserCard from "~/components/UserCard";
import pkg from "image-conversion";

const {compressAccurately, EImageType} = pkg;
import {deleteAccount, getUserMovies} from "~/.server/functions";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const username = await checkLogin(request);
    const movies = await getUserMovies(username)

    return json({avatar: "/avatar/" + username, username, movies}, {headers: {'Cache-Control': 'no-cache'}});
}

const createDir = () => {
    if (!fs.existsSync("./public/uavatar")) {
        fs.mkdirSync("./public/uavatar");
    }
}

const removeAvatar = (user: string) => {
    try {
        fs.rmSync("./public/uavatar/" + user + ".jpg");
    } catch {
    }
    try {
        fs.rmSync("./public/uavatar/" + user + ".gif");
    } catch {
    }
}

export const action = async ({request}: ActionFunctionArgs) => {
    const username = await checkLogin(request);
    const fileUp = unstable_createFileUploadHandler({
        maxPartSize: 5_000_000
    });
    const formDataFile = await unstable_parseMultipartFormData(request, fileUp);
    const formType = formDataFile.get("formType");

    if (formType === 'deleteAccount') {
        return json({err: null, data: await deleteAccount(username)})
    }

    const uploaded = formDataFile.get("filename")
    if (!uploaded) {
        return json({err: "Upload failed."})
    }
    const uploadType: string = uploaded.type;
    if (uploadType === "image/gif") {
        removeAvatar(username)
        fs.copyFile(uploaded.filepath, './public/uavatar/' + username + ".gif", (err) => {
            if (err) throw err;
            console.log(username, "uploaded avatar");
        })
        return json({err: null}, {headers: {"Cache-Control": "no-cache"}});
    }
    if (uploadType !== "image/jpeg" && uploadType !== "image/png") {
        return json({err: "Image extension must be .jpeg, .jpg, .png, or .gif"})
    }
    createDir()

    let uploadedFileBlob: Promise<Blob> = new Promise((resolve, reject) => {
        fs.readFile(uploaded.filepath, (err, data) => {
            if (err) console.log(err);
            const b = new Blob([data], {type: "text/plain"});
            resolve(b)
        })
    });
    const blob = await uploadedFileBlob;

    removeAvatar(username)
    try {
        const jpegBlob = await compressAccurately(blob, {
            accuracy: 0.9,
            type: EImageType.JPEG,
        })
        const jpegImage = new File([jpegBlob], username + ".jpg", {
            lastModified: new Date().getTime(),
            type: "image/jpeg",
        })
        const imageArrayBuffer = await jpegImage.arrayBuffer();
        const imagebuffer = Buffer.from(imageArrayBuffer);
        fs.writeFile("./public/uavatar/" + username + ".jpg", imagebuffer, (err) => {
            if (err) throw ("Error writing file to folder")
            else console.log("Avatar created successfully.")
        })
        return json({err: null}, {headers: {"Cache-Control": "no-cache"}});
    } catch (e) {
        console.log("Error creating file", e)
        return json({err: "Unable to save the file"}, {headers: {"Cache-Control": "no-cache"}});
    }
}

const FileUpload = () => {
    const {avatar, username, movies} = useLoaderData<typeof loader>()
    return (
        <UserCard src={avatar} username={username} userMovies={movies.length}/>
    )
}
export default FileUpload;