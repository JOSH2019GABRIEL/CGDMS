import "../../style/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddFishPerformance = () => {
  const [fishPerformanceLog, setFishPerformanceLog] = useState({
    id: "",
    date: "",
    pondId: "",
    batchId: "",
    avgWeightG: "",
    liveCount: "",
    biomassKg: "",
  });

  const [ponds, setPonds] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

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

  // Fetch fish performance log if editing
  useEffect(() => {
    if (id) {
      const fetchFishPerformanceLog = async () => {
        try {
          const response = await axios.get(`${baseUrl}fish-performance/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFishPerformanceLog(response.data);
        } catch (error) {
          console.error("Error fetching fish performance log:", error);
          toast.error("Could not load fish performance log");
        }
      };
      fetchFishPerformanceLog();
    }
  }, [id, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFishPerformanceLog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Save or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}fish-performance/${id}`, fishPerformanceLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Fish performance log updated successfully!");
      } else {
        await axios.post(`${baseUrl}fish-performance`, fishPerformanceLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Fish performance log submitted successfully!");
      }

      setTimeout(() => {
        navigate("/dashboard/fish-performances");
      }, 1000);
    } catch (error) {
      console.error("Error saving fish performance log:", error);
      toast.error(
        error.response?.data?.message || "Error saving fish performance log."
      );
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Fish Performance Log" : "Add Fish Performance Log"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={fishPerformanceLog.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Pond:</label>
                <select
                  name="pondId"
                  value={fishPerformanceLog.pondId || ""}
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
                <label>Batch ID:</label>
                <input
                  type="text"
                  name="batchId"
                  value={fishPerformanceLog.batchId || ""}
                  onChange={handleChange}
                  placeholder="Enter batch ID"
                  required
                />
              </div>

              <div className="formInput">
                <label>Average Weight (g):</label>
                <input
                  type="number"
                  name="avgWeightG"
                  value={fishPerformanceLog.avgWeightG || ""}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="formInput">
                <label>Live Count:</label>
                <input
                  type="number"
                  name="liveCount"
                  value={fishPerformanceLog.liveCount || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Biomass (kg):</label>
                <input
                  type="number"
                  name="biomassKg"
                  value={fishPerformanceLog.biomassKg || ""}
                  onChange={handleChange}
                  step="0.01"
                  disabled
                  // required
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

export default AddFishPerformance;
