// src/App.js
import React, { useContext } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";

// Import route groups
import { CoreRoutes } from "./routes/CoreRoutes";
import { AquacultureRoutes } from "./routes/AquacultureRoutes";
import { BroilerRoutes } from "./routes/BroilerRoutes";
import { VegetablesRoutes } from "./routes/VegetablesRoutes";

import "./style/dark.scss";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter basename="/api/v1">
        <Routes>
          {CoreRoutes}
          {AquacultureRoutes}
          {BroilerRoutes}
          {VegetablesRoutes}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
