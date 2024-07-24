import {useEffect, useState} from 'react';
import {FaMoon, FaSun} from "react-icons/fa";

export default function ThemeToggler() {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <span onClick={toggleTheme} className={'themeToggler'}>
      {theme === 'light' ? <FaMoon size={28}/> : <FaSun color={"#eeeeee"} size={28}/>}
    </span>
    );
}
