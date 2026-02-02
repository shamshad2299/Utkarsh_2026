import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./store/ContextStore";
import { AdminProvider } from "./store/AdminContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AdminProvider>
        <App />
      </AdminProvider>
      
    </AuthProvider>
  </React.StrictMode>,
);
