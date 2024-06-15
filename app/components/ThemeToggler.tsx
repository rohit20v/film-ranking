import {useState} from "react";
import {IoInvertMode, IoInvertModeOutline} from "react-icons/io5";

const ThemeToggler = () => {
    const [currentTheme, setCurrentTheme] = useState("pumpkin");

    const toggleTheme = () => {
        const newTheme = currentTheme === "pumpkin" ? "blue" : "pumpkin";
        setCurrentTheme(newTheme);

        const links = document.querySelectorAll("link[rel=stylesheet]") as NodeListOf<HTMLLinkElement>;
        links.forEach((link) => {
            if (link.href.includes("pico.pumpkin.min.css")) {
                link.href = link.href.replace("pico.pumpkin.min.css", `pico.${newTheme}.min.css`);
            } else {
                link.href = link.href.replace("pico.blue.min.css", `pico.${newTheme}.min.css`);
            }
        });
    };

    return (
        <button style={{display:"flex", alignItems:"center",justifyContent:"center", margin: 8}} onClick={toggleTheme}>
            {currentTheme === "pumpkin" ? <IoInvertMode/> : <IoInvertModeOutline />}
        </button>
    );
};

export default ThemeToggler;
