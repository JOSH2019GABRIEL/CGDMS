import "../../style/new.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewFarm = () => {
  const [newFarm, setNewFarm] = useState({
    farmName: "",
    location: "",
    organizationId: "",
    sizeInHectares: "",
  });

  const [organizations, setOrganizations] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams(); // <-- if editing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFarm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch organizations for dropdown
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await axios.get(`${baseUrl}organizations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrganizations(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast.error("Could not load organizations");
      }
    };
    fetchOrgs();
  }, [token]);

  // Fetch farm if editing
  useEffect(() => {
    if (id) {
      const fetchFarm = async () => {
        try {
          const response = await axios.get(`${baseUrl}farms/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewFarm(response.data);
        } catch (error) {
          console.error("Error fetching farm:", error);
          toast.error("Failed to load farm details.");
        }
      };
      fetchFarm();
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update farm
        await toast.promise(
          axios.put(`${baseUrl}farms/${id}`, newFarm, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          {
            pending: "Updating farm...",
            success: "Farm updated successfully!",
            error: "Error updating farm",
          }
        );
      } else {
        // Add new farm
        await toast.promise(
          axios.post(`${baseUrl}farms`, newFarm, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          {
            pending: "Saving farm...",
            success: "Farm added successfully!",
            error: "Error adding farm",
          }
        );
      }

      navigate("/dashboard/farms");
    } catch (error) {
      console.error("Error saving farm:", error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Farm" : "Add Farm"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Name:</label>
                <input
                  type="text"
                  name="farmName"
                  value={newFarm.farmName}
                  onChange={handleChange}
                  placeholder="Name of farm"
                  required
                />
              </div>
              <div className="formInput">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={newFarm.location}
                  onChange={handleChange}
                  placeholder="Farm Location"
                  required
                />
              </div>
              <div className="formInput">
                <label>Size in Hectare:</label>
                <input
                  type="number"
                  name="sizeInHectares"
                  value={newFarm.sizeInHectares}
                  onChange={handleChange}
                  placeholder="Enter Size in Hectares"
                  required
                />
              </div>

              <div className="formInput">
                <label>Organization:</label>
                <select
                  name="organizationId"
                  value={newFarm.organizationId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Organization --</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
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

export default AddNewFarm;
