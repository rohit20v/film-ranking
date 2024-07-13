import {NavLink} from "@remix-run/react";
import ThemeToggler from "~/components/ThemeToggler";
import {useRef, useState} from "react";
import {destroySession, getSession} from "~/session";

function Navbar() {
    const menu = useRef()
    const [isMenuToggled, setIsMenuToggled] = useState(false);

    const toggleMenu = () => {
        if (menu.current) {
            menu.current.classList.toggle('ham-menu');
            setIsMenuToggled(prevState => !prevState)
        }
    };

    return (
        <nav>
            <ul>
                <li><a href="./" style={{marginLeft: "8px", textDecoration: "none"}}><strong
                    className={'title'}>CINEPHILIA!</strong></a></li>
            </ul>
            <ul className={"menu-list"}>
                <li>
                    <NavLink className={"navLink"} to={"./"}>Home</NavLink>
                </li>
                <li>
                    <NavLink className={"navLink"} to={"./films"}>Movies</NavLink>
                </li>
                <li>
                    <NavLink className={"navLink"} to={"./search_user"}>Search user</NavLink>
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
            </ul>
            <li className={'ham'}>
                <span onClick={toggleMenu} ref={menu}>
                <span hidden={isMenuToggled}>
                    MENU
                </span>
                    {isMenuToggled && (<div className={'ham-menu'}>
                        <li>
                            <NavLink className={"navLink"} to={"./"}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink className={"navLink"} to={"./films"}>Movies</NavLink>
                        </li>
                        <li>
                            <NavLink className={"navLink"} to={"./search_user"}>Search user</NavLink>
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
                    </div>)}
                </span>
            </li>

        </nav>
    );
}

export default Navbar;