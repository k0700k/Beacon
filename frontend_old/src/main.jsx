import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CSS_VARS } from "./config/theme";
import "./index.css";

// Apply theme CSS custom properties to :root from theme.js
Object.entries(CSS_VARS).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
