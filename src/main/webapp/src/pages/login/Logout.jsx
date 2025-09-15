import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.scss";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const timer = setTimeout(() => {
      navigate("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logout-container">
      <div className="spinner"></div>
      <p>Logging you out... </p>
    </div>
  );
};

export default Logout;
