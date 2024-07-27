import {NavLink} from "@remix-run/react";
import ThemeToggler from "~/components/ThemeToggler";
import {useRef, useState} from "react";
import {RxHamburgerMenu} from "react-icons/rx";

function Navbar({user}: { user?: string }) {
    const menu = useRef()
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const [nav, setNav] = useState(false);
    const toggleMenu = () => {
        if (menu.current) {
            menu.current.classList.toggle('ham-menu');
            setIsMenuToggled(prevState => !prevState)
        }
    };

    const changeNavColor = () => {
        if (window.scrollY >= 80) {
            setNav(true);
        } else setNav(false)
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
                <li>
                    <NavLink className={"navLink"} to={"./sign_in"}>Sign In</NavLink>
                </li>
                <li>
                    <NavLink className={"navLink"} to={"./login"}>Login</NavLink>
                </li>
                <li>
                    <ThemeToggler/>
                    <p>{user ?? ""}</p>
                    {/*Just testing*/}
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
                        <li>
                            <NavLink className={"navLink"} to={"./sign_in"}>Sign In</NavLink>
                        </li>
                        <li>
                            <NavLink className={"navLink"} to={"./login"}>Login</NavLink>
                        </li>
                    </ul>)}
                </span>
                <ThemeToggler/>
            </li>

        </nav>
    );
}

export default Navbar;