// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    if (userRole === "Supervisor") {
      return <Navigate to="/supervisordashboard" replace />;
    }
    if (userRole === "RM") {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
