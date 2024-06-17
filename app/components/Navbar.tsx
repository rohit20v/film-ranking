import {NavLink} from "@remix-run/react";
import ThemeToggler from "~/components/ThemeToggler";
// import Lottie from 'lottie-react';
// import hamburgerData from '../assets/hamburga.json'

function Navbar() {
    //
    // const defaultOptions = {
    //     animationData: hamburgerData,
    //     rendererSettings: {
    //         preserveAspectRatio: "xMidYMid slice"
    //     }
    // };
    return (
        <nav>
            <ul>
                <li><a href="./" style={{marginLeft: "8px", textDecoration: "none"}}><strong>YES</strong></a></li>
            </ul>
            <ul>
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