import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const ThemeToggle = ({ isOpen }) => {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const currentTheme = localStorage.getItem("theme") || "light";
		setTheme(currentTheme);
		document.documentElement.setAttribute("data-theme", currentTheme);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
	};

	return (
		<a className="fs-3 p-3 w-100" onClick={toggleTheme}>
			{theme === "light" ? (
				<FontAwesomeIcon className="me-3" icon={faMoon} />
			) : (
				<FontAwesomeIcon className="me-3" icon={faSun} />
			)}
			{isOpen && <>{theme === "light" ? "Dark theme" : "Light theme"}</>}
		</a>
	);
};

export default ThemeToggle;
