
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// export default function PublicRoute({ children }) {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();

//   // Allow access to public routes (e.g., /login) if not authenticated
//   if (!isAuthenticated && location.pathname === "/login") {
//     return children; // Show login page if not authenticated
//   }

//   // If authenticated and trying to access /login, redirect to the appropriate dashboard
//   if (isAuthenticated && location.pathname === "/login") {
//     return <Navigate to="/supervisordashboard" replace />; // Default to Supervisor dashboard; adjust logic if needed
//   }

//   // If not authenticated and not on /login, redirect to login
//   if (!isAuthenticated && location.pathname !== "/login") {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return children; // Allow access to the requested route if authenticated and on a public path
// }


// src/routes/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicRoute() {
  const { isAuthenticated } = useAuth();

  // Only allow access to public routes (e.g., /login) if not authenticated
  if (isAuthenticated) {
    return <Navigate to="/supervisordashboard" replace />; // Redirect authenticated users
  }

  return <Outlet />; // Allow access to public routes
}