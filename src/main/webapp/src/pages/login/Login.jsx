import "./login.scss";
import React, { useState } from "react";
import {
  Visibility,
  VisibilityOff,
  Info,
  LockOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import Logo from "../../components/images/illustration-dashboard.webp";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url as baseUrl } from "../../api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseUrl}auth/authenticate`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, fullName, farmName, roles } = response.data;

      // ✅ Store securely in localStorage
      localStorage.setItem("token", token);
      if (fullName) localStorage.setItem("fullName", fullName);
      if (farmName) localStorage.setItem("farmName", farmName);
      if (roles) localStorage.setItem("roles", JSON.stringify(roles));

      toast.success("Login successful 🎉");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Try again ❌"
      );
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="login-left">
        <div className="brand-logo"> LIVESTOCK DATA MANAGEMENT SYSTEM</div>
        <h1>Welcome Back 👋</h1>
        <p>Sign in to manage livestock data effectively and efficiently.</p>

        <div className="illustration">
          <img src={Logo} alt="Login Illustration" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <h2>Sign in to your account</h2>

        <div className="info-box">
          <Info className="info-icon" />
          Try demo: <strong>admin@system.com</strong> / <strong>Admin123</strong>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <label>Email address</label>
          <div className="input-with-icon">
            <EmailOutlined className="field-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
            />
          </div>

          {/* Password Field */}
          <label>Password</label>
          <div className="password-input">
            <LockOutlined className="field-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <span onClick={togglePassword} className="eye-icon">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="password-row">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {/* Button with Spinner */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <div className="btn-spinner">
                <div className="loader"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Login;
