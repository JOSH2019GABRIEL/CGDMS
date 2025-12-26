import "../../style/new.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewEnvironmentLog = () => {
  const [envLog, setEnvLog] = useState({
    id: "",
    pondId: "",
    measuredAt: "",
    temperatureC: "",
    dissolvedOxygenMgL: "",
    ammoniaMgL: "",
    turbidityNtu: "",
    salinityPpt: "",
    ph: "",
    fromSensor: false,
    notes: "",
  });

  const [ponds, setPonds] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch ponds for dropdown
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

  // Fetch env log if editing
  useEffect(() => {
    if (id) {
      const fetchEnvLog = async () => {
        try {
          const response = await axios.get(`${baseUrl}env-logs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEnvLog(response.data);
        } catch (error) {
          console.error("Error fetching environment log:", error);
          toast.error("Could not load environment log");
        }
      };
      fetchEnvLog();
    }
  }, [id, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnvLog((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}env-logs/${id}`, envLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Environment log updated successfully!");
      } else {
        await axios.post(`${baseUrl}env-logs`, envLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Environment log submitted successfully!");
      }

      navigate("/dashboard/environment-logs");
    } catch (error) {
      console.error("Error saving environment log:", error);
      toast.error(
        error.response?.data?.message || "Error saving environment log."
      );
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Environment Log" : "Add Environment Log"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Measured At:</label>
                <input
                  type="datetime-local"
                  name="measuredAt"
                  value={envLog.measuredAt || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Pond:</label>
                <select
                  name="pondId"
                  value={envLog.pondId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Pond --</option>
                  {ponds.map((pond) => (
                    <option key={pond.id} value={pond.id}>
                    {pond.name} - Available {pond.availableFingerlin}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Temperature (°C):</label>
                <input
                  type="number"
                  name="temperatureC"
                  value={envLog.temperatureC || ""}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>

              <div className="formInput">
                <label>Dissolved Oxygen (mg/L):</label>
                <input
                  type="number"
                  name="dissolvedOxygenMgL"
                  value={envLog.dissolvedOxygenMgL || ""}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>

              <div className="formInput">
                <label>Ammonia (mg/L):</label>
                <input
                  type="number"
                  name="ammoniaMgL"
                  value={envLog.ammoniaMgL || ""}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              <div className="formInput">
                <label>Turbidity (NTU):</label>
                <input
                  type="number"
                  name="turbidityNtu"
                  value={envLog.turbidityNtu || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Salinity (ppt):</label>
                <input
                  type="number"
                  name="salinityPpt"
                  value={envLog.salinityPpt || ""}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>

              <div className="formInput">
                <label>pH:</label>
                <input
                  type="number"
                  name="ph"
                  value={envLog.ph || ""}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              <div className="formInput">
                <label>Notes:</label>
                <textarea
                  name="notes"
                  value={envLog.notes || ""}
                  onChange={handleChange}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="formInput checkboxInput">
                <label></label>
                <label>
                  <input
                    type="checkbox"
                    name="fromSensor"
                    checked={envLog.fromSensor}
                    onChange={(e) =>
                      setEnvLog({ ...envLog, fromSensor: e.target.checked })
                    }
                  />
                  <span className="slider"></span>
                  <span style={{ marginLeft: "8px" }}>From Sensor</span>
                </label>
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

export default AddNewEnvironmentLog;
