import { useState } from "react";
import "./login.scss";
import {token, url as baseUrl } from "../../api";
import axios from "axios";
import { toast, ToastContainer} from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

   const handleSubmit = (e) => {
  e.preventDefault();

  axios.post(
    `${baseUrl}auth/authenticate`,
    { email, password }, // ✅ send login credentials
    { headers: { "Content-Type": "application/json" } }
  )
  .then((response) => {
    // Save token
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    console.log(response.data)

    toast.success("Login successful ✅");
    // redirect example
    window.location.href = "/";
  })
  .catch((error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Invalid email or password ❌");
      } else {
        toast.error(error.response.data.message || "Something went wrong");
      }
    } else {
      toast.error("Network error. Please try again.");
    }
  });
};

    return (
        <div className="login">
             <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <div className="loginwrapper">
                <form onSubmit={handleSubmit}>
                    <span className="desk">Login Credentials</span>

                    <div className="formInput">
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="formInput">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">Login</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
