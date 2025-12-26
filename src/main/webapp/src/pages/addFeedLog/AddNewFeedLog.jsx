import "../../style/new.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const FeedLog = () => {
  const [feedLog, setFeedLog] = useState({
    id: "",
    date: "",
    pondId: "",
    batchId: "",
    feedType: "",
    brand: "",
    quantityKg: "",
    method: "",
    timeOfDay: "",
    staffId: "",
    notes: "",
  });

  const [ponds, setPonds] = useState([]);
  // const [batches, setBatches] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams(); //

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
      const fetchFeedLog = async () => {
        try {
          const response = await axios.get(`${baseUrl}feed-logs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFeedLog(response.data);
        } catch (error) {
          console.error("Error fetching feed log:", error);
          toast.error("Could not load feed log");
        }
      };
      fetchFeedLog();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedLog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}feed-logs/${id}`, feedLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feed log updated successfully!");
      } else {
        await axios.post(`${baseUrl}feed-logs`, feedLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feed log submitted successfully!");
      }

      navigate("/dashboard/feed-log");
    } catch (error) {
      console.error("Error saving feed log:", error);
      toast.error(error.response?.data?.message || "Error saving feed log.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Feed Log" : "Add Feed Log"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={feedLog.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Pond:</label>
                <select
                  name="pondId"
                  value={feedLog.pondId || ""}
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
                <label>Feed Type:</label>
                <select
                  name="feedType"
                  value={feedLog.feedType || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Feed Type --</option>
                  <option value="Floating">Floating</option>
                  <option value="Sinking">Sinking</option>
                  <option value="Crumble">Crumble</option>
                  <option value="Pellet">Pellet</option>
                  <option value="Mash">Mash</option>
                </select>
              </div>

              <div className="formInput">
                <label>Brand:</label>
                <input
                  type="text"
                  name="brand"
                  value={feedLog.brand || ""}
                  onChange={handleChange}
                  placeholder="Enter Brand Name"
                />
              </div>

              <div className="formInput">
                <label>Quantity (Kg):</label>
                <input
                  type="number"
                  name="quantityKg"
                  value={feedLog.quantityKg || ""}
                  onChange={handleChange}
                  placeholder="Enter Quantity in Kg"
                  required
                />
              </div>

              <div className="formInput">
                <label>Feeding Method:</label>
                <select
                  name="method"
                  value={feedLog.method || ""}
                  onChange={handleChange}
                >
                  <option value="">-- Select Feeding Method --</option>
                  <option value="Broadcast">Broadcast</option>
                  <option value="Spot Feeding">Spot Feeding</option>
                  <option value="Tray Feeding">Tray Feeding</option>
                  <option value="Hand Feeding">Hand Feeding</option>
                  <option value="Automatic Feeder">Automatic Feeder</option>
                </select>
              </div>

              <div className="formInput">
                <label>Time of Day:</label>
                <input
                  type="time"
                  name="timeOfDay"
                  value={feedLog.timeOfDay || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Notes:</label>
                <textarea
                  name="notes"
                  value={feedLog.notes || ""}
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

export default FeedLog;
