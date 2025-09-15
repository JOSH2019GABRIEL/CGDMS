import "../../style/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewEnvironmentLog = () => {
  const [environmentLog, setEnvironmentLog] = useState({
    id: "",
    pondId: "",
    measuredAt: "",
    temperatureC: "",
    dissolvedOxygenMgL: "",
    ammoniaMgL: "",
    turbidityNtu: "",
    salinityPpt: "",
    ph: "",
    fromSensor: true,
    notes: "",
  });

  const [ponds, setPonds] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

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
      const fetchEnvironmentLog = async () => {
        try {
          const response = await axios.get(`${baseUrl}env-logs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEnvironmentLog(response.data);
        } catch (error) {
          console.error("Error fetching environment log:", error);
          toast.error("Could not load environment log");
        }
      };
      fetchEnvironmentLog();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnvironmentLog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}env-logs/${id}`, environmentLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Environment log updated successfully!");
      } else {
        await axios.post(`${baseUrl}env-logs`, environmentLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Environment log submitted successfully!");
      }

      setTimeout(() => {
        navigate("/dashboard/environment-logs");
      }, 1000);
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
                  value={environmentLog.measuredAt || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Pond:</label>
                <select
                  name="pondId"
                  value={environmentLog.pondId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Pond --</option>
                  {ponds.map((pond) => (
                    <option key={pond.id} value={pond.id}>
                      {pond.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Temperature (°C):</label>
                <input
                  type="number"
                  name="temperatureC"
                  value={environmentLog.temperatureC || ""}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>

              <div className="formInput">
                <label>Dissolved Oxygen (mg/L):</label>
                <input
                  type="number"
                  name="dissolvedOxygenMgL"
                  value={environmentLog.dissolvedOxygenMgL || ""}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>

              <div className="formInput">
                <label>Ammonia (mg/L):</label>
                <input
                  type="number"
                  name="ammoniaMgL"
                  value={environmentLog.ammoniaMgL || ""}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              <div className="formInput">
                <label>Turbidity (NTU):</label>
                <input
                  type="number"
                  name="turbidityNtu"
                  value={environmentLog.turbidityNtu || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Salinity (ppt):</label>
                <input
                  type="number"
                  name="salinityPpt"
                  value={environmentLog.salinityPpt || ""}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>

              <div className="formInput">
                <label>pH:</label>
                <input
                  type="number"
                  name="ph"
                  value={environmentLog.ph || ""}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              <div className="formInput">
                <label>Notes:</label>
                <textarea
                  name="notes"
                  value={environmentLog.notes || ""}
                  onChange={handleChange}
                  placeholder="Additional notes..."
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

export default AddNewEnvironmentLog;
