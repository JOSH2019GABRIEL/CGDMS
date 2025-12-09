// src/components/Dashboard/DarkModeToggle.jsx
import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "1");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", dark ? "1" : "0");
  }, [dark]);

  return (
    <button className="darkToggle" onClick={() => setDark(d => !d)}>
      {dark ? "Light" : "Dark"}
    </button>
  );
};

export default DarkModeToggle;
