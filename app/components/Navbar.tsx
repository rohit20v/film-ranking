import {NavLink} from "@remix-run/react";
import ThemeToggler from "~/components/ThemeToggler";

function Navbar() {
    return (
        <nav>
            <ul>
                <li><a href="./" style={{marginLeft:"8px", textDecoration: "none"}}><strong>YES</strong></a></li>
            </ul>
            <ul>
                <li>
                    <NavLink className={"navLink"} to={"./"}>Home</NavLink>
                </li>
                <li>
                    <NavLink className={"navLink"} to={"./films"}>Movies</NavLink>
                </li>
                <li>
                    <NavLink className={"navLink"} to={"./add-film"}>Add movies</NavLink>
                </li>
                <li>
                    <ThemeToggler/>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;