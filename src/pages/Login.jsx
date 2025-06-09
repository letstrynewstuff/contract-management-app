import React, { useState, useContext } from "react";
import bgImage from "../assets/img/login-bg.png";
import logo from "../assets/img/Group.png";
import profileIcon from "../assets/img/profile.svg";
import lockIcon from "../assets/img/lock.svg";
import { useNavigate } from "react-router-dom";
import  AuthContext from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Login data:", formData);
    setPage(1); // Proceed to OTP page
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtpError("");
    setLoading(true);

    setTimeout(() => {
      console.log("OTP verified:", otp);
      login(formData.role); // Pass the role to the login function
      // Navigate based on role
      if (formData.role === "Supervisor") {
        navigate("/supervisordashboard");
      } else {
        navigate("/"); // Default navigation (e.g., dashboard for RM)
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-white p-4 overflow-hidden border-20 border-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "2rem",
        overflow: "hidden",
      }}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent spinner"></div>
          <p className="text-sm font-medium text-gray-700">Logging in...</p>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-row justify-between items-center">
          {/* Left Text Section */}
          <div className="hidden lg:flex flex-col text-white ml-12 mt-80 max-w-md">
            <h1 className="text-5xl font-light leading-tight mb-4">
              Contracts Made Digital
            </h1>
            <p className="text-sm mb-6">
              Create, sign and send all your contracts in one, safe place.
            </p>
          </div>

          {/* Right Login Form */}
          <div className="bg-white w-full max-w-md h-full p-15 shadow-xl rounded-2xl">
            <div className="flex flex-col items-center mb-6">
              <img src={logo} alt="Logo" className="w-20 h-auto mb-2" />
              <div className="text-center text-lg font-bold">
                <p>CONTRACT</p>
                <p>DIGITIZATION</p>
              </div>
            </div>

            {page === 0 && (
              <form
                onSubmit={handleLogin}
                className="space-y-4 p-5 rounded-2xl bg-white shadow-md"
              >
                <div>
                  <p className="text-sm font-medium">Welcome</p>
                  <h2 className="text-lg font-bold">User Log in</h2>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs">Enter Username</label>
                  <div className="flex items-center border rounded">
                    <span className="bg-gray-100 px-3 py-2">
                      <img
                        src={profileIcon}
                        alt="Profile"
                        className="w-4 h-4"
                      />
                    </span>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="flex-1 px-2 py-2 text-sm focus:outline-none"
                      placeholder="username"
                    />
                    <span className="bg-gray-100 px-3 py-2 text-xs font-bold">
                      @user.ng
                    </span>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs">Enter Password</label>
                  <div className="flex items-center border rounded">
                    <span className="bg-gray-100 px-3 py-2">
                      <img src={lockIcon} alt="Lock" className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="flex-1 px-2 py-2 text-sm focus:outline-none"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={handleTogglePassword}
                      className="text-xs text-blue-600 px-3"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="text-xs">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded text-sm"
                  >
                    <option value="">Select option</option>
                    <option value="RM">Relationship Manager</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded text-sm font-semibold hover:bg-orange-600 transition"
                >
                  Log in
                </button>
              </form>
            )}

            {page === 1 && (
              <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 shadow-md">
                <h2 className="text-xl font-bold text-center mb-4">
                  Enter OTP
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                  We sent a 6-digit code to your registered email. Enter it
                  below.
                </p>

                <form onSubmit={handleOtpSubmit}>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      if (e.target.value.length <= 6) {
                        setOtp(e.target.value);
                      }
                    }}
                    className="w-full border px-4 py-2 text-center rounded text-lg tracking-widest"
                    placeholder="••••••"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  {otpError && (
                    <p className="text-red-500 text-xs text-center">
                      {otpError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded text-sm font-semibold hover:bg-orange-600 transition"
                  >
                    Verify OTP
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    Didn’t receive a code?{" "}
                    <button
                      className="text-blue-600 hover:underline"
                      type="button"
                    >
                      Resend
                    </button>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
