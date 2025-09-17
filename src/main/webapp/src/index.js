import React from "react";
// import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";

// ReactDOM.render(
//   <React.StrictMode>
//     <DarkModeContextProvider>
//       <App />
//     </DarkModeContextProvider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <App />
    </DarkModeContextProvider>
  </React.StrictMode>
);