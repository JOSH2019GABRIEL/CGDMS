import "../../style/new.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AddNewStaff = () => {
  const [newStaff, setNewStaff] = useState({
    firstname: "",
    lastname: "",
    // cadre: "",
    cadreId: "",
    phone: "",
    dateOfBirth: "",
    email: "",
    password: "",
    roleId: "",
    farmId: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams(); // <-- get staffId from route (for edit)
  const [roles, setRoles] = useState([]);
  const [farms, setFarms] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${baseUrl}roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, [token]);

  // fetch cadres
  useEffect(() => {
    const fetchCadres = async () => {
      try {
        const response = await axios.get(`${baseUrl}cadres`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCadres(response.data.content);
      } catch (error) {
        console.error("Error fetching cadres:", error);
      }
    };
    fetchCadres();
  }, [token]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(`${baseUrl}farms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Herer ", response.data);
        setFarms(response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };
    fetchFarms();
  }, [token]);

  useEffect(() => {
    if (id) {
      const fetchStaff = async () => {
        try {
          const response = await axios.get(`${baseUrl}staff/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewStaff(response.data);
          console.log("Herer ", response.data);
        } catch (error) {
          console.error("Error fetching staff:", error);
        }
      };
      fetchStaff();
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await toast.promise(
          axios.put(`${baseUrl}staff/${id}`, newStaff, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          {
            pending: "Updating staff...",
            success: "Staff updated successfully!",
            error: "Error updating staff",
          }
        );
      } else {
        await toast.promise(
          axios.post(`${baseUrl}staff/register`, newStaff, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          {
            pending: "Saving staff...",
            success: "Staff added successfully!",
            error: "Error adding staff",
          }
        );
      }

      navigate("/dashboard/staff-user");
    } catch (error) {
      console.error("Error saving staff:", error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Staff" : "Add Staff"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstname"
                  value={newStaff.firstname}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>
              <div className="formInput">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastname"
                  value={newStaff.lastname}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>

              <div className="formInput">
                <label>Cadre:</label>
                <select
                  name="cadreId"
                  value={newStaff.cadreId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Cadre Name --</option>
                  {cadres.map((cadre) => (
                    <option key={cadre.id} value={cadre.id}>
                      {cadre.cadreName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>Telephone:</label>
                <input
                  type="text"
                  name="phone"
                  value={newStaff.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="formInput">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newStaff.dateOfBirth || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="formInput">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newStaff.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>
              {!id && ( // only show password input when creating
                <div className="formInput">
                  <label>Password:</label>
                  <div className="passwordWrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={newStaff.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      minLength={8}
                    />
                    <span onClick={togglePassword} className="eye-icon">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </span>
                  </div>
                </div>
              )}

              <div className="formInput">
                <label>Farm:</label>
                <select
                  name="farmId"
                  value={newStaff.farmId}
                  onChange={handleChange}
                >
                  <option value="">-- Select Farm --</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.farmName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Role:</label>
                <select
                  name="roleId"
                  value={newStaff.roleId || ""}
                  onChange={handleChange}
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit">{id ? "Update" : "Save"}</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddNewStaff;
