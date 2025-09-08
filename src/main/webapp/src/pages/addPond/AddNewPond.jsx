import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate } from "react-router-dom";

const AddNewPond = () => {
  const [newPond, setNewPond] = useState({
    id: "",
    name: "",
    capacity: "",
    location: "",
    status: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPond((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddPond = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}ponds`, newPond, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Batch submitted successfully:", response.data);
      toast.success("Submitted successfully!");

      setNewPond({
        id: "",
        name: "",
        capacity: "",
        location: "",
        status: "",
      });
      navigate("/dashboard/batches");
    } catch (error) {
      console.error("Error adding batch:", error);
      toast.error(error.response?.data?.message || "Error adding batch.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add Pond</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleAddPond}>
              <div className="formInput">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newPond.name}
                  onChange={handleChange}
                  placeholder="Name of Pond"
                  required
                />
              </div>
              <div className="formInput">
                <label>Capacity of Pond:</label>
                <input
                  type="number"
                  name="capacity"
                  value={newPond.capacity}
                  onChange={handleChange}
                  placeholder="Pond capacity"
                  required
                />
              </div>
              <div className="formInput">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={newPond.location}
                  onChange={handleChange}
                  placeholder="Location of Pond"
                  required
                />
              </div>
              <div className="formInput">
                <label>Pond Status:</label>
                <select
                  name="status"
                  value={newPond.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Pond Status --</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="NOT_ACTIVE">NOT ACTIVE</option>
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

export default AddNewPond;
