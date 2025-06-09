import { Link,  } from "react-router-dom";
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../assets/img/Group.png";
import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function Navbar() {
  const { userRole, logout } = useContext(AuthContext);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    console.log(
      "User logged out at",
      new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })
    );
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 shadow-md font-roboto">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
            .font-roboto { font-family: 'Roboto', sans-serif; }
            @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          `}
        </style>
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto" />
        </div>

        {/* Center: Navigation Links (Hidden on Mobile) */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 text-gray-700 font-medium text-sm lg:text-base">
          {userRole === "Supervisor" ? (
            <Link to="/supervisordashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
          ) : userRole === "RM" ? (
            <Link to="/" className="hover:text-blue-600">
              Dashboard
            </Link>
          ) : null}
          <Link to="/contracts" className="hover:text-blue-600">
            Contracts
          </Link>
          <Link to="/" className="hover:text-blue-600">
            Templates
          </Link>
        </div>

        {/* Right: Notification, Profile, Logout (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <FaBell className="text-lg lg:text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-xl lg:text-2xl text-gray-600" />
            <span className="text-gray-700 font-semibold text-sm lg:text-base">
              {userRole === "Supervisor"
                ? "Danjuma Omorola"
                : userRole === "RM"
                ? "Abike Hassan"
                : "Guest"}
            </span>
          </div>
          <div className="h-5 w-px bg-gray-300" />
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 font-medium hover:underline text-sm lg:text-base"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        {/* Hamburger Menu (Visible on Mobile) */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-600"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>
      </nav>

      {/* Sidebar for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-30 backdrop-blur-xs z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <div
            className="fixed top-0 left-0 w-64 bg-white h-full shadow-lg p-4 transition-transform duration-300 ease-in-out transform translate-x-0 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button
                  onClick={toggleSidebar}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <div className="flex flex-col space-y-4 text-gray-700 font-medium text-base">
                {userRole === "Supervisor" ? (
                  <Link
                    to="/supervisordashboard"
                    className="hover:text-blue-600"
                    onClick={toggleSidebar}
                  >
                    Dashboard
                  </Link>
                ) : userRole === "RM" ? (
                  <Link
                    to="/"
                    className="hover:text-blue-600"
                    onClick={toggleSidebar}
                  >
                    Dashboard
                  </Link>
                ) : null}
                <Link
                  to="/contracts"
                  className="hover:text-blue-600"
                  onClick={toggleSidebar}
                >
                  Contracts
                </Link>
                <Link
                  to="/"
                  className="hover:text-blue-600"
                  onClick={toggleSidebar}
                >
                  Templates
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <FaBell className="text-lg text-gray-600 hover:text-blue-600 cursor-pointer" />
                <FaUserCircle className="text-xl text-gray-600" />
                <span className="text-gray-700 font-semibold text-sm">
                  {userRole === "Supervisor"
                    ? "Supervisor"
                    : userRole === "RM"
                    ? "John Doe"
                    : "Guest"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-500 font-medium hover:underline text-sm"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
