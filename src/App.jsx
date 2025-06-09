import { Routes, Route } from "react-router-dom";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

// Route Guards
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ContractList from "./pages/ContractList";
import ContractDetails from "./pages/ContractDetails";
import CreateContract from "./pages/CreateContract";
import EditContract from "./pages/EditContract";
import NotFound from "./pages/NotFound";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      {/* <Navbar /> */}

      <Routes>
        {/* Public Auth Routes */}
        <Route
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private Routes for RM (Relationship Manager) */}
        <Route
          element={
            <PrivateRoute allowedRoles={["RM"]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<ContractList />} />
          <Route path="/contracts/create" element={<CreateContract />} />
          <Route path="/contracts/:id" element={<ContractDetails />} />
        </Route>

        {/* Private Routes for Supervisor */}
        <Route
          element={
            <PrivateRoute allowedRoles={["Supervisor"]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/supervisordashboard"
            element={<SupervisorDashboard />}
          />
          <Route path="/contracts/:id/edit" element={<EditContract />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
