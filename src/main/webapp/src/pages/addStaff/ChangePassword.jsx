import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}staff/change-password`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      navigate("/dashboard/staff-user");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Error changing password");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Change Password</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Old Password */}
              <div className="formInput">
                <label>Old Password:</label>
                <div className="passwordWrapper">
                  <input
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handleChange}
                    placeholder="Enter old password"
                  />
                  <span
                    onClick={() => setShowOld((p) => !p)}
                    className="eye-icon"
                  >
                    {showOld ? <VisibilityOff /> : <Visibility />}
                  </span>
                </div>
              </div>

              {/* New Password */}
              <div className="formInput">
                <label>New Password:</label>
                <div className="passwordWrapper">
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  <span
                    onClick={() => setShowNew((p) => !p)}
                    className="eye-icon"
                  >
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="formInput">
                <label>Confirm Password:</label>
                <div className="passwordWrapper">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  <span
                    onClick={() => setShowConfirm((p) => !p)}
                    className="eye-icon"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </span>
                </div>
              </div>
              <div className="formInput">
                <input hidden />
              </div>

              <button type="submit">Update Password</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
