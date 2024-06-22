import {NavLink} from "@remix-run/react";
import ThemeToggler from "~/components/ThemeToggler";

function Navbar() {
    return (
        <nav>
            <ul>
                <li><a href="./" style={{marginLeft: "8px", textDecoration: "none"}}><strong>YES</strong></a></li>
            </ul>
            <ul className={"menu-list"}>
                <li>
                    <NavLink className={"navLink"} to={"./"}>Home</NavLink>
                </li>
                <li>
                    <NavLink className={"navLink"} to={"./films"}>Movies</NavLink>
                </li>
                <li>
                    <NavLink className={"navLink"} to={"./sign_in"}>Sign In</NavLink>
                </li>
                <li>
                    <NavLink className={"navLink"} to={"./login"}>Login</NavLink>
                </li>
                <li>
                    <ThemeToggler/>
                </li>
                <li>
                    {/*<Lottie*/}
                    {/*    options={defaultOptions}*/}
                    {/*    height={400}*/}
                    {/*    width={400} animationData={hamburgerData}/>*/}
                    MENU
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;