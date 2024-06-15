import {NavLink} from "@remix-run/react";

function Navbar() {
    return (
        <>
            <nav>
                <ul style={{display: "flex", justifyContent: "space-around"}}>
                    <li>
                        <NavLink className={"navLink"} to={"./"} >Home</NavLink>
                    </li>
                    <li>
                        <NavLink className={"navLink"} to={"./add-film"}>Add movies</NavLink>
                    </li>
                </ul>

            </nav>
        </>
    );
}

export default Navbar;