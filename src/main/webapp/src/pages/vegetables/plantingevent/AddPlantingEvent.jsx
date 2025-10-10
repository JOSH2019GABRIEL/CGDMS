import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddPlantingEvent = () => {
  const { id } = useParams();
  const [plots, setPlots] = useState([]);
  const [crops, setCrops] = useState([]);
  const [overrideDate, setOverrideDate] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [plantingEvent, setPlantingEvent] = useState({
    id: "",
    date: "",
    plotId: "",
    cropId: "",
    seedBatch: "",
    seedCount: "",
    expectedHarvestDate: "",
  });

  // Fetch plots
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axios.get(`${baseUrl}plot`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlots(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching plots:", error);
        toast.error("Could not load plots.");
      }
    };
    fetchPlots();
  }, [token]);

  // Fetch crops
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get(`${baseUrl}crop-varieties`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCrops(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching crops:", error);
        toast.error("Could not load crops.");
      }
    };
    fetchCrops();
  }, [token]);

  // Fetch planting event (for editing)
  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`${baseUrl}planting-events/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPlantingEvent(response.data);
        } catch (error) {
          console.error("Error fetching planting event:", error);
          toast.error("Could not load planting event details.");
        }
      };
      fetchEvent();
    }
  }, [token]);

  // Auto-calculate expected harvest date
//   useEffect(() => {
//     if (plantingEvent.date && plantingEvent.cropId && !overrideDate) {
//       const selectedCrop = crops.find((crop) => crop.id === Number(plantingEvent.cropId));
//       if (selectedCrop?.expectedDaysToHarvest) {
//         const plantDate = new Date(plantingEvent.date);
//         const harvestDate = new Date(plantDate);
//         harvestDate.setDate(harvestDate.getDate() + selectedCrop.expectedDaysToHarvest);
//         setPlantingEvent((prev) => ({
//           ...prev,
//           expectedHarvestDate: harvestDate.toISOString().split("T")[0],
//         }));
//       }
//     }
//   }, [plantingEvent.date, plantingEvent.cropId, crops, overrideDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlantingEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
        await axios.post(`${baseUrl}planting-events`, plantingEvent, {
          headers: { Authorization: `Bearer ${token}` },
        });
      toast.success(id ? "Planting event updated successfully!" : "Planting event created successfully!");
      navigate("/dashboard/planting-events");
    } catch (error) {
      console.error("Error saving planting event:", error);
      toast.error(error.response?.data?.message || "Error saving planting event.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Planting Event" : "Add Planting Event"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Date */}
              <div className="formInput">
                <label>Planting Date:</label>
                <input
                  type="date"
                  name="date"
                  value={plantingEvent.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Plot Dropdown */}
              <div className="formInput">
                <label>Plot:</label>
                <select
                  name="plotId"
                  value={plantingEvent.plotId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Plot --</option>
                  {plots.map((plot) => (
                    <option key={plot.id} value={plot.id}>
                      {plot.name || `Plot ${plot.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop Dropdown */}
              <div className="formInput">
                <label>Crop:</label>
                <select
                  name="cropId"
                  value={plantingEvent.cropId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Crop --</option>
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.cropName} - ({crop.variety})
                    </option>
                  ))}
                </select>
              </div>

              {/* Seed Batch */}
              <div className="formInput">
                <label>Seed Batch:</label>
                <input
                  type="text"
                  name="seedBatch"
                  value={plantingEvent.seedBatch || ""}
                  onChange={handleChange}
                  placeholder="Enter seed batch"
                  required
                />
              </div>

              {/* Seed Count */}
              <div className="formInput">
                <label>Seed Count:</label>
                <input
                  type="number"
                  name="seedCount"
                  value={plantingEvent.seedCount || ""}
                  onChange={handleChange}
                  placeholder="Enter seed count"
                  required
                />
              </div>

              {/* Expected Harvest Date */}
              <div className="formInput">
                <label>Expected Harvest Date:</label>
                <input
                  type="date"
                  name="expectedHarvestDate"
                  value={plantingEvent.expectedHarvestDate || ""}
                  onChange={handleChange}
                  placeholder="Enter Expected Harvest Date"
                  required
                />
              </div>

              {/* <div className="formInput">
                <label>
                  Expected Harvest Date:
                  <input
                    type="checkbox"
                    checked={overrideDate}
                    onChange={() => setOverrideDate(!overrideDate)}
                    style={{ marginLeft: "8px" }}
                  />
                  Override
                </label>
                <input
                  type="date"
                  name="expectedHarvestDate"
                  value={plantingEvent.expectedHarvestDate || ""}
                  onChange={handleChange}
                  disabled={!overrideDate}
                />
              </div> */}

              <button type="submit">{id ? "Update" : "Save"}</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPlantingEvent;
