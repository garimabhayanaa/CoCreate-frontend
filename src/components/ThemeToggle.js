import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import "../stylesheets/ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {theme === "dark" ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
      <span className="theme-text">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
};

export default ThemeToggle;
