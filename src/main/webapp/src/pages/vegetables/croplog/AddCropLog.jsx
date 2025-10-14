import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddCropLog = () => {
  const { id } = useParams();
  const [plots, setPlots] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [cropLog, setCropLog] = useState({
    id: "",
    date: "",
    cropStage: "",
    otherCropStage: "", // 👈 for “Others”
    irrigationL: "",
    fertilizerG: "",
    pesticideApplied: "",
    otherPesticide: "", // 👈 for “Others”
  });

  // Fetch plots
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axios.get(`${baseUrl}plot`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlots(response.data.content || []);
      } catch (error) {
        console.error("Error fetching plots:", error);
        toast.error("Could not load plots");
      }
    };
    fetchPlots();
  }, [token]);

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${baseUrl}staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaffList(response.data.content || []);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error("Could not load staff list");
      }
    };
    fetchStaff();
  }, [token]);

  // Fetch crop log if editing
  useEffect(() => {
    if (id) {
      const fetchCropLog = async () => {
        try {
          const response = await axios.get(`${baseUrl}crop-logs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCropLog(response.data);
        } catch (error) {
          console.error("Error fetching crop log:", error);
          toast.error("Could not load crop log details.");
        }
      };
      fetchCropLog();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCropLog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...cropLog,
      cropStage:
        cropLog.cropStage === "Others" && cropLog.otherCropStage
          ? cropLog.otherCropStage
          : cropLog.cropStage,
      pesticideApplied:
        cropLog.pesticideApplied === "Others" && cropLog.otherPesticide
          ? cropLog.otherPesticide
          : cropLog.pesticideApplied,
    };

    try {
      await axios.post(`${baseUrl}crop-logs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(id ? "Crop log updated successfully!" : "Crop log created successfully!");
      setTimeout(() => {
      navigate("/dashboard/veg-crop-logs");
      }, 1000);
    } catch (error) {
      console.error("Error saving crop log:", error);
      setTimeout(() => {
      toast.error(error.response?.data?.message || "Error saving crop log.");
      }, 1000);

    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Crop Log" : "Add Crop Log"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={cropLog.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Crop Stage:</label>
                <select
                  name="cropStage"
                  value={cropLog.cropStage || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Crop Stage --</option>
                  <option value="Planting">Planting</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Harvesting">Harvesting</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {cropLog.cropStage === "Others" && (
                <div className="formInput">
                  <label>Specify Crop Stage:</label>
                  <input
                    type="text"
                    name="otherCropStage"
                    value={cropLog.otherCropStage || ""}
                    onChange={handleChange}
                    placeholder="Enter crop stage"
                  />
                </div>
              )}

              <div className="formInput">
                <label>Irrigation (L):</label>
                <input
                  type="number"
                  step="0.01"
                  name="irrigationL"
                  value={cropLog.irrigationL || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Fertilizer (g):</label>
                <input
                  type="number"
                  step="0.01"
                  name="fertilizerG"
                  value={cropLog.fertilizerG || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Pesticide Applied:</label>
                <select
                  name="pesticideApplied"
                  value={cropLog.pesticideApplied || ""}
                  onChange={handleChange}
                >
                  <option value="">-- Select Pesticide --</option>
                  <option value="None">None</option>
                  <option value="Herbicide">Herbicide</option>
                  <option value="Fungicide">Fungicide</option>
                  <option value="Insecticide">Insecticide</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {cropLog.pesticideApplied === "Others" && (
                <div className="formInput">
                  <label>Specify Pesticide:</label>
                  <input
                    type="text"
                    name="otherPesticide"
                    value={cropLog.otherPesticide || ""}
                    onChange={handleChange}
                    placeholder="Enter pesticide name"
                  />
                </div>
              )}

              <div className="formInput">
                <label>Plot:</label>
                <select
                  name="plotId"
                  value={cropLog.plotId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Plot --</option>
                  {plots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || `Plot ${p.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <input
                  hidden
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

export default AddCropLog;
