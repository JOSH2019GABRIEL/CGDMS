// import "./login.scss";
// import React, { useState } from "react";
// import { Visibility, VisibilityOff, Info } from "@mui/icons-material";
// import Logo from "../../components/images/illustration-dashboard.webp";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { url as baseUrl } from "../../api";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
   
//    // Store in localStorage
//    localStorage.setItem('token', token);
//    localStorage.setItem('fullName', fullName);
//    localStorage.setItem('farmName', farmName);
//    localStorage.setItem('roles', JSON.stringify(roles));


//   const togglePassword = () => setShowPassword((prev) => !prev);

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const response = await axios.post(
//       `${baseUrl}auth/authenticate`,
//       {
//         email,
//         password,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     toast.success("Login successful 🎉");
//     localStorage.setItem("token", response.data.token);

//     setTimeout(() => {
//       navigate("/dashboard");
//     }, 1500);
//   } catch (error) {
//     toast.error(
//       error.response?.data?.message || "Login failed. Try again ❌"
//     );
//   }
// };

//   return (
//     <div className="login-container">
//       <div className="login-left">
//         <div className="brand-logo"> LIVESTOCK DATA MANAGEMENT SYSTEM</div>
//         <h1>Hi, Welcome back</h1>
//         <p>More effectively with optimized workflows.</p>
//         <div className="illustration">
//           <img src={Logo} alt="illustration" />
//         </div>
//       </div>

//       <div className="login-right">
//         <h2>Sign in to your account</h2>

//         <div className="info-box">
//           <Info className="info-icon" />
//           Use &nbsp; <strong> admin@gmail.com </strong>&nbsp; with password{" "}
//           <strong>&nbsp; @Admin2025 </strong>
//         </div>

//         <form className="login-form" onSubmit={handleSubmit}>
//           <label>Email address</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="admin@gmail.com"
//             required
//           />

//           <div className="password-row">
//             <label>Password</label>
            
//           </div>
//           <div className="password-input">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//             />
//             <span onClick={togglePassword} className="eye-icon">
//               {showPassword ? <VisibilityOff /> : <Visibility />}
//             </span>
//           </div>

//           <button type="submit" className="login-btn">
//             Sign in
//           </button>
//         </form>
//       </div>
//       <ToastContainer position="top-right" autoClose={2000} />
//     </div>
//   );
// };

// export default Login;
import "./login.scss";
import React, { useState } from "react";
import { Visibility, VisibilityOff, Info } from "@mui/icons-material";
import Logo from "../../components/images/illustration-dashboard.webp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url as baseUrl } from "../../api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="login-left">
        <div className="brand-logo"> LIVESTOCK DATA MANAGEMENT SYSTEM</div>
        <h1>Hi, Welcome back</h1>
        <p>More effectively with optimized workflows.</p>
        <div className="illustration">
          <img src={Logo} alt="illustration" />
        </div>
      </div>

      <div className="login-right">
        <h2>Sign in to your account</h2>

        <div className="info-box">
          <Info className="info-icon" />
          Use <strong>admin@gmail.com</strong> with password
          <strong> @Admin2025 </strong>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
            required
          />

          <div className="password-row">
            <label>Password</label>
          </div>
          <div className="password-input">
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

          <button type="submit" className="login-btn">
            Sign in
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Login;

