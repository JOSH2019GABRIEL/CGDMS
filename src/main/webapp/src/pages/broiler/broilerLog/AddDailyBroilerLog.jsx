import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddDailyBroilerLog = () => {
  const { id } = useParams();
  const [log, setLog] = useState({
    id: "",
    date: "",
    flockId: "",
    feedType: "",
    feedQtyKg: "",
    waterCheck: "",
    temp: "",
    mortalityCount: "",
    notes: "",
    // staffId: "",
  });

  const [flocks, setFlocks] = useState([]);
  const [staff, setStaff] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch flocks
  useEffect(() => {
    const fetchFlocks = async () => {
      try {
        const response = await axios.get(`${baseUrl}flocks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlocks(response.data.content);
      } catch (error) {
        console.error("Error fetching flocks:", error);
        toast.error("Could not load flocks");
      }
    };
    fetchFlocks();
  }, [token]);

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${baseUrl}staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(response.data.content);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error("Could not load staff");
      }
    };
    fetchStaff();
  }, [token]);

  // Fetch log if editing
  useEffect(() => {
  if (id) {
    const fetchLog = async () => {
      try {
        const response = await axios.get(`${baseUrl}daily-flock-log/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched log data:", response.data);

        const logData = response.data.data || response.data;
        setLog(logData);
      } catch (error) {
        console.error("Error fetching log:", error);
        toast.error("Could not load log details.");
      }
    };
    fetchLog();
  }
}, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
        await axios.post(`${baseUrl}daily-flock-log`, log, {
          headers: { Authorization: `Bearer ${token}` },
        });

      toast.success(
        id ? "Log updated successfully!" : "Log created successfully!"
      );
      navigate("/dashboard/broiler-log");
    } catch (error) {
      console.error("Error saving log:", error);
      toast.error(error.response?.data?.message || "Error saving log.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Daily Log" : "Add Daily Log"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={log.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Flock:</label>
                <select
                  name="flockId"
                  value={log.flockId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Flock --</option>
                  {flocks.map((flock) => (
                    <option key={flock.id} value={flock.id}>
                      {flock.id} - {flock.source}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Feed Type:</label>
                <select
                  name="feedType"
                  value={log.feedType || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Feed Type --</option>
                  <option value="Starter">Starter</option>
                  <option value="Grower">Grower</option>
                  <option value="Finisher">Finisher</option>
                  <option value="Layer Mash">Layer Mash</option>
                  <option value="Broiler Concentrate">
                    Broiler Concentrate
                  </option>
                </select>
              </div>

              <div className="formInput">
                <label>Feed Quantity (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="feedQtyKg"
                  value={log.feedQtyKg || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Water Check:</label>
                <select
                  name="waterCheck"
                  value={log.waterCheck || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Water Status --</option>
                  <option value="OK">OK</option>
                  <option value="Needs Refill">Needs Refill</option>
                  <option value="Issue">Issue</option>
                </select>
              </div>

              <div className="formInput">
                <label>Temperature (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  name="temp"
                  value={log.temp || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Mortality Count:</label>
                <input
                  type="number"
                  name="mortalityCount"
                  value={log.mortalityCount || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Notes:</label>
                <textarea
                  name="notes"
                  value={log.notes || ""}
                  onChange={handleChange}
                  placeholder="Enter observations or issues"
                  rows={3}
                />
              </div>

              {/* <div className="formInput">
                <label>Staff:</label>
                <select
                  name="staffId"
                  value={log.staffId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Staff --</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
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

export default AddDailyBroilerLog;
