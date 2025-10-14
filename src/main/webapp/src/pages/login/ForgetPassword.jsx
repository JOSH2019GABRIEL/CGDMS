import React, { useState } from "react";
import "./forgetPassword.scss";
import { EmailOutlined, ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url as baseUrl } from "../../api";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `${baseUrl}auth/${email}/reset-password`,
        {}, // empty body
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Password reset defaultPassword");
      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-container">
      <div className="forget-card">
        <h2>Forgot Password?</h2>
        <p>
          Enter your registered email address and we’ll send you a link to reset
          your password to <strong> defaultPassword </strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <EmailOutlined className="input-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Reset Password"}
          </button>
        </form>

        <div className="back-link">
          <ArrowBack fontSize="small" />
          <Link to="/">Back to Login</Link>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ForgetPassword;
