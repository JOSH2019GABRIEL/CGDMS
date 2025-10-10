import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddCropVariety = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [newVariety, setNewVariety] = useState({
    id: "",
    cropName: "",
    variety: "",
    seedRateGPerM2: "",
    expectedDaysToHarvest: "",
    greenhouseDaysAdjustment: "",
    spacing: "",
  });

  // Fetch crop variety details if editing
  useEffect(() => {
    if (id) {
      const fetchVariety = async () => {
        try {
          const response = await axios.get(`${baseUrl}crop-varieties/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewVariety(response.data);
        } catch (error) {
          console.error("Error fetching crop variety:", error);
          toast.error("Could not load crop variety details.");
        }
      };
      fetchVariety();
    }
  }, [id, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVariety((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
          await axios.post(`${baseUrl}crop-varieties`, newVariety, {
          headers: { Authorization: `Bearer ${token}` },
        });
     toast.success(id ? "Crop variety updated successfully!" : "Crop variety created successfully!");


      navigate("/dashboard/crop-varieties");
    } catch (error) {
      console.error("Error saving crop variety:", error);
      toast.error(error.response?.data?.message || "Error saving crop variety.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{id ? "Edit Crop Variety" : "Add Crop Variety"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              
              {/* Crop Name */}
              <div className="formInput">
                <label>Crop Name:</label>
                <select
                  name="cropName"
                  value={newVariety.cropName || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Crop --</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Maize">Maize</option>
                  <option value="Rice">Rice</option>
                  <option value="Pepper">Pepper</option>
                  <option value="Cucumber">Cucumber</option>
                  <option value="Lettuce">Lettuce</option>
                  <option value="Onion">Onion</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Variety */}
              <div className="formInput">
                <label>Variety:</label>
                <input
                  type="text"
                  name="variety"
                  value={newVariety.variety || ""}
                  onChange={handleChange}
                  placeholder="e.g. Oba Super 2, Roma VF"
                  required
                />
              </div>

              {/* Seed Rate */}
              <div className="formInput">
                <label>Seed Rate (g/m²):</label>
                <input
                  type="number"
                  step="0.01"
                  name="seedRateGPerM2"
                  value={newVariety.seedRateGPerM2 || ""}
                  onChange={handleChange}
                  placeholder="e.g. 5.5"
                  required
                />
              </div>

              {/* Expected Days to Harvest */}
              <div className="formInput">
                <label>Expected Days to Harvest:</label>
                <input
                  type="number"
                  name="expectedDaysToHarvest"
                  value={newVariety.expectedDaysToHarvest || ""}
                  onChange={handleChange}
                  placeholder="e.g. 90"
                  required
                />
              </div>

              {/* Greenhouse Days Adjustment */}
              <div className="formInput">
                <label>Greenhouse Days Adjustment:</label>
                <input
                  type="number"
                  name="greenhouseDaysAdjustment"
                  value={newVariety.greenhouseDaysAdjustment || ""}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                />
              </div>

              {/* Spacing */}
              <div className="formInput">
                <label>Spacing:</label>
                <select
                  name="spacing"
                  value={newVariety.spacing || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Spacing --</option>
                  <option value="30x30 cm">30x30 cm</option>
                  <option value="45x45 cm">45x45 cm</option>
                  <option value="60x60 cm">60x60 cm</option>
                  <option value="75x25 cm">75x25 cm</option>
                  <option value="Broadcast">Broadcast</option>
                  <option value="Other">Other</option>
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

export default AddCropVariety;
