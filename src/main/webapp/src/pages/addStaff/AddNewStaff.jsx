import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate } from "react-router-dom";

const AddNewStaff = () => {
  const [newStaff, setNewStaff] = useState({
    firstname: "",
    lastname: "",
    cadre: "",
    phone: "",
    dateOfBirth: "",
    email: "",
    password: "",
    roleId: "",
    farmId: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [farms, setFarms] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(`${baseUrl}farms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarms(response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };
    fetchFarms();
  }, [token]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.post(`${baseUrl}staff/register`, newStaff, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          pending: "Saving staff...",
          success: "Submitted successfully",
          error: "Error adding staff",
        }
      );

      setNewStaff({
        firstname: "",
        lastname: "",
        cadre: "",
        phone: "",
        dateOfBirth: "",
        email: "",
        password: "",
        roleId: "",
        farmId: "",
      });

      navigate("/dashboard/staff-user");
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add Staff</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleAddStaff}>
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
                  placeholder="Enter Last name"
                />
              </div>
              <div className="formInput">
                <label>Cadre:</label>
                <input
                  type="text"
                  name="cadre"
                  value={newStaff.cadre}
                  onChange={handleChange}
                  placeholder="Enter Cadre"
                />
              </div>
              <div className="formInput">
                <label>Telephone:</label>
                <input
                  type="text"
                  name="phone"
                  value={newStaff.phone}
                  onChange={handleChange}
                  placeholder="Enter telephone Number"
                />
              </div>

              <div className="formInput">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newStaff.dateOfBirth}
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
                  placeholder="Enter email address"
                />
              </div>

              <div className="formInput">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={newStaff.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
              </div>

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
                      {farm.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="formInput">
                <label>Role:</label>
                <select
                  name="roleId"
                  value={newStaff.roleId}
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
              <div className="formInput">
                {/* <label>Farm:</label> */}
                <input
                  type="text"
                  name="farmId"
                  value={newStaff.farmId}
                  onChange={handleChange}
                  placeholder="Enter Farm"
                  hidden
                />
              </div>

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddNewStaff;
