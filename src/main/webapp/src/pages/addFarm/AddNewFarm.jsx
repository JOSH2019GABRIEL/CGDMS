import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate } from "react-router-dom";

const AddNewFarm = () => {
  const [newFarm, setNewFarm] = useState({
    farmName: "", 
    location: "",
    organizationId: "",
    sizeInHectares: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFarm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddOrg = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseUrl}farms`,
        newFarm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Farm submitted successfully:", response.data);
      toast.success("Submitted successfully!");

      // Reset form
      setNewFarm({
        farmName: "", 
        location: "",
        organizationId: "",
        sizeInHectares: "",
      });

      // ✅ Redirect after short delay (to let toast show)
      // setTimeout(() => {
        navigate("/dashboard/farms");
      // }, 1000);

    } catch (error) {
      console.error("Error adding farm:", error);
      toast.error(error.response?.data?.message || "Error adding farm.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add Farm</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleAddOrg}>
              <div className="formInput">
                <label>Name:</label>
                <input
                  type="text"
                  name="farmName"
                  value={newFarm.farmName}
                  onChange={handleChange}
                  placeholder="Name of farm"
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
                />
              </div>
              <div className="formInput">
                <label>Size in Hectare:</label>
                <input
                  type="text"
                  name="sizeInHectares"
                  value={newFarm.sizeInHectares}
                  onChange={handleChange}
                  placeholder="Enter Size in Hectares"
                />
              </div>
              {/* <div className="formInput">
                <label>Organization:</label>
                <input
                  type="text"
                  name="organizationId"
                  value={newFarm.organizationId}
                  onChange={handleChange}
                  placeholder="Organization Name"
                />
              </div> */}

              <div className="formInput">
              <label>Organization:</label>
              <select
                name="organizationId"
                value={newFarm.organizationId}
                onChange={handleChange}
              >
                <option value="">Select an organization</option>
                <option value="1">Organization 1</option>
                <option value="2">Organization 2</option>
                <option value="3">Organization 3</option>
                {/* Add more options as needed */}
              </select>
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

export default AddNewFarm;
