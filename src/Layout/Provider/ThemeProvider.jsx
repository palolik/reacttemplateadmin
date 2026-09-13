import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const ThemeContext = createContext(null);

const THEME_KEY = "admin-theme";

const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
};

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
};
