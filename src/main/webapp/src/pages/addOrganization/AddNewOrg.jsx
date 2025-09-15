import "../../style/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewOrg = () => {
  const [newOrg, setNewOrg] = useState({
    name: "",
    contactEmail: "",
    address: "",
    contactPhone: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams(); // <-- get orgId from route for editing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrg((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch organization if editing
  useEffect(() => {
    if (id) {
      const fetchOrg = async () => {
        try {
          const response = await axios.get(`${baseUrl}organizations/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewOrg(response.data);
        } catch (error) {
          console.error("Error fetching organization:", error);
          toast.error("Failed to load organization details.");
        }
      };
      fetchOrg();
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update existing organization
        await toast.promise(
          axios.put(`${baseUrl}organizations/${id}`, newOrg, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          {
            pending: "Updating organization...",
            success: "Organization updated successfully!",
            error: "Error updating organization",
          }
        );
      } else {
        // Add new organization
        await toast.promise(
          axios.post(`${baseUrl}organizations`, newOrg, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          {
            pending: "Saving organization...",
            success: "Organization added successfully!",
            error: "Error adding organization",
          }
        );
      }

      navigate("/dashboard/organizations");
    } catch (error) {
      console.error("Error saving organization:", error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Organization" : "Add Organization"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newOrg.name}
                  onChange={handleChange}
                  placeholder="Name of Organization"
                  required
                />
              </div>
              <div className="formInput">
                <label>Email:</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={newOrg.contactEmail}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="formInput">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={newOrg.address}
                  onChange={handleChange}
                  placeholder="Address of Organization"
                  required
                />
              </div>
              <div className="formInput">
                <label>Telephone:</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={newOrg.contactPhone}
                  onChange={handleChange}
                  placeholder="Telephone Number"
                  required
                />
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

export default AddNewOrg;
