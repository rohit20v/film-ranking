import {NavLink} from "@remix-run/react";

function Navbar() {
    return (
        <>
            <nav>
                <ul>
                    <li><strong>YES</strong></li>
                </ul>
                <ul>
                    <li>
                        <NavLink className={"navLink"} to={"./"}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink className={"navLink"} to={"./add-film"}>Add movies</NavLink>
                    </li>
                    <li>
                        <NavLink className={"navLink"} to={"./login"}>Login</NavLink>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Navbar;