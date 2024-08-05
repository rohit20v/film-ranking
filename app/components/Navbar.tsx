import {NavLink} from "@remix-run/react";
import ThemeToggler from "~/components/ThemeToggler";
import {useRef, useState} from "react";
import {RxHamburgerMenu} from "react-icons/rx";
import ProfileSelect, {logout} from "~/components/ProfileSelect";

function Navbar({user}: { user?: string }) {
    const menu = useRef<HTMLElement>()
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const [nav, setNav] = useState(false);
    const toggleMenu = () => {
        if (menu.current) {
            menu.current.classList.toggle('ham-menu');
            setIsMenuToggled(prevState => !prevState)
        }
    };

    const changeNavColor = () => {
        setNav(window.scrollY >= 80);
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', changeNavColor)
    }

    return (
        <nav className={nav ? "navbar active" : "navbar"}>
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
                {!user ?
                    <>
                        <li>
                            <NavLink className={"navLink"} to={"./sign_in"}>Sign up</NavLink>
                        </li>
                        <li>
                            <NavLink className={"navLink"} to={"./login"}>Login</NavLink>
                        </li>
                    </> :
                    <li>
                        <ProfileSelect pfp={"/avatar/" + user}/>
                    </li>
                }
                <li>
                    <ThemeToggler/>
                </li>
            </ul>
            <li className={'ham'}>
                <span onClick={toggleMenu} ref={menu}>
                <span hidden={isMenuToggled}>
                    <RxHamburgerMenu size={28}/>
                </span>
                    {isMenuToggled && (<ul className={'ham-menu'}>
                        <li>
                            <NavLink className={"navLink"} to={"./"}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink className={"navLink"} to={"./films"}>Movies</NavLink>
                        </li>
                        <li>
                            <NavLink className={"navLink"} to={"./search_user"}>Search user</NavLink>
                        </li>
                        {!user ?
                            <>
                                <li>
                                    <NavLink className={"navLink"} to={"./sign_in"}>Sign up</NavLink>
                                </li>
                                <li>
                                    <NavLink className={"navLink"} to={"./login"}>Login</NavLink>
                                </li>
                            </>
                            :
                            <>
                                <li>
                                    <NavLink className={"navLink"} to={"./profile"}>Profile</NavLink>
                                </li>
                                <li onClick={logout}>
                                    <NavLink className={"navLink"} to={"./"}>Logout</NavLink>
                                </li>
                            </>
                        }
                    </ul>)}
                </span>
                <ThemeToggler/>
            </li>

        </nav>
    );
}

export default Navbar;