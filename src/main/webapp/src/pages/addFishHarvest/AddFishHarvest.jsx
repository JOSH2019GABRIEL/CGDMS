import "../../style/new.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddFishHarvest = () => {
  const [fishHarvest, setFishHarvest] = useState({
    id: "",
    batchId: "",
    pondId: "",
    harvestDate: "",
    harvestOfficer: "",
    productionCycle: "",
    totalFishHarvested: "",
    averageWeightKg: "",
    totalWeightKg: "",
    mortalityDuringHarvest: "",
    gradingCategory: "",
  });

  const [batches, setBatches] = useState([]);
  const [ponds, setPonds] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${baseUrl}batch`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatches(response.data.content);
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast.error("Could not load batches");
      }
    };
    fetchBatches();
  }, [token]);

  // Fetch ponds
  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const response = await axios.get(`${baseUrl}ponds`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPonds(response.data.content);
      } catch (error) {
        console.error("Error fetching ponds:", error);
        toast.error("Could not load ponds");
      }
    };
    fetchPonds();
  }, [token]);

  useEffect(() => {
    if (id) {
      const fetchFishHarvest = async () => {
        try {
          const response = await axios.get(`${baseUrl}fish-harvest/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFishHarvest(response.data);
        } catch (error) {
          console.error("Error fetching harvest:", error);
          toast.error("Could not load fish harvest details");
        }
      };
      fetchFishHarvest();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFishHarvest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}fish-harvest`, fishHarvest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(id ? "Fish Harvest updated successfully!" : "Fish Harvest created successfully!");
      setTimeout(() => {
      navigate("/dashboard/fish-harvests");
      }, 1000);
    } catch (error) {
      console.error("Error saving Fish harvest:", error);
      toast.error(error.response?.data?.message || "Error saving fish harvest.");
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Fish Harvest" : "Add Fish Harvest"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Harvest Date:</label>
                <input
                  type="date"
                  name="harvestDate"
                  value={fishHarvest.harvestDate || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Pond:</label>
                <select
                  name="pondId"
                  value={fishHarvest.pondId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Pond --</option>
                  {ponds.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Batch:</label>
                <select
                  name="batchId"
                  value={fishHarvest.batchId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Batch --</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.stockDate} / {b.source} - {b.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Harvest Officer:</label>
                <input
                  type="text"
                  name="harvestOfficer"
                  value={fishHarvest.harvestOfficer || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Production Cycle:</label>
                <input
                  type="text"
                  name="productionCycle"
                  value={fishHarvest.productionCycle || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Total Fish Harvested:</label>
                <input
                  type="number"
                  name="totalFishHarvested"
                  value={fishHarvest.totalFishHarvested || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Average Weight (kg):</label>
                <input
                  type="number"
                  name="averageWeightKg"
                  value={fishHarvest.averageWeightKg || ""}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="formInput">
                <label>Total Weight (kg):</label>
                <input
                  type="number"
                  name="totalWeightKg"
                  value={fishHarvest.totalWeightKg || ""}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="formInput">
                <label>Mortality During Harvest:</label>
                <input
                  type="number"
                  name="mortalityDuringHarvest"
                  value={fishHarvest.mortalityDuringHarvest || ""}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              <div className="formInput">
                <label>Grading Category:</label>
                <input
                  type="text"
                  name="gradingCategory"
                  value={fishHarvest.gradingCategory || ""}
                  onChange={handleChange}
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

export default AddFishHarvest;
