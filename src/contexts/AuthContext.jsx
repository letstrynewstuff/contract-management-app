// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      const lastLogin = localStorage.getItem("lastLogin");
      const now = new Date().getTime();
      if (lastLogin && now - lastLogin > 24 * 60 * 60 * 1000) {
        // 24-hour expiration
        logout();
      } else {
        setUserRole(role);
        setIsAuthenticated(true);
        localStorage.setItem("lastLogin", now);
      }
    }
  }, []);

  const login = (role) => {
    const now = new Date().getTime();
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem("userRole", role);
    localStorage.setItem("lastLogin", now);
    console.log(
      "Logged in as:",
      role,
      "at",
      new Date(now).toLocaleString("en-US", { timeZone: "Africa/Lagos" })
    );
  };

  const logout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userRole");
    localStorage.removeItem("lastLogin");
    console.log(
      "Logged out, redirecting to /login at",
      new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })
    );
    window.location.href = "/login"; // Force redirect
  };

  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
