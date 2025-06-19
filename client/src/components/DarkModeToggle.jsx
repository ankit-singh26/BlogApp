// src/components/DarkModeToggle.jsx
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { setDarkMode } from "../utils/theme";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    setDarkMode(isDark);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      title="Toggle theme"
    >
      {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
    </button>
  );
};

export default DarkModeToggle;
