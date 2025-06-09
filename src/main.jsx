import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ContractProvider } from "./contexts/ContractContext.jsx"; // Import ContractProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContractProvider>
          <App />
        </ContractProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
