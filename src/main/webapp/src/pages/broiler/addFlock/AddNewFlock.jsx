import "../../../style/new.scss";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewFlock = () => {
  const { id } = useParams();
  const [farms, setFarms] = useState([]);
  const [newFlock, setNewFlock] = useState({
    id: "",
    houseId: "",
    farmId: "",
    farmName: "",
    source: "",
    hatchDate: "",
    stockingCount: "",
    sexRatio: "",
    expectedCycleDays: "",
    targetWeight: "",
    vaccineProfile: "",
  });

  const [houses, setHouses] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


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
  }, [id, token]);

  
  // Fetch houses
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(`${baseUrl}farm`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHouses(response.data.content);
      } catch (error) {
        console.error("Error fetching houses:", error);
        toast.error("Could not load houses");
      }
    };
    fetchHouses();
  }, [token]);

  // Fetch flock details if editing
  useEffect(() => {
    if (id) {
      const fetchFlock = async () => {
        try {
          const response = await axios.get(`${baseUrl}flocks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewFlock(response.data); // prefill form
        } catch (error) {
          console.error("Error fetching flock:", error);
          toast.error("Could not load flock details.");
        }
      };
      fetchFlock();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFlock((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}flocks`, newFlock, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(id ? "Flock updated successfully!" : "Flock created successfully!");
      setTimeout(() => {
      navigate("/dashboard/flock");
      }, 1000);
    } catch (error) {
      console.error("Error saving flock:", error);
      toast.error(error.response?.data?.message || "Error saving flock.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Flock" : "Add Flock"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
             <div className="formInput">
                <label>House:</label>
                <select
                  name="farmId"
                  value={newFlock.farmId || ""}
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
                <label>Source:</label>
                <input
                  type="text"
                  name="source"
                  value={newFlock.source || ""}
                  onChange={handleChange}
                  placeholder="Enter source"
                  required
                />
              </div>

              <div className="formInput">
                <label>Hatch Date:</label>
                <input
                  type="date"
                  name="hatchDate"
                  value={newFlock.hatchDate || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Stocking Count:</label>
                <input
                  type="number"
                  name="stockingCount"
                  value={newFlock.stockingCount || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Sex Ratio (M:F):</label>
                <input
                  type="text"
                  name="sexRatio"
                  value={newFlock.sexRatio || ""}
                  onChange={handleChange}
                  placeholder="e.g. 60:40"
                  required
                />
              </div>

              <div className="formInput">
                <label>Expected Cycle (Days):</label>
                <input
                  type="number"
                  name="expectedCycleDays"
                  value={newFlock.expectedCycleDays || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Target Weight (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="targetWeight"
                  value={newFlock.targetWeight || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Vaccine Profile:</label>
                <textarea
                  name="vaccineProfile"
                  value={newFlock.vaccineProfile || ""}
                  onChange={handleChange}
                  placeholder="Enter vaccine schedule/profile"
                  rows={3}
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

export default AddNewFlock;
