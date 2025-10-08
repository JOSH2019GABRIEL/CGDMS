import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddSlaughterLog = () => {
  const { id } = useParams();
  const [log, setLog] = useState({
    id: "",
    processId: "",
    birdsReceived: "",
    birdsSlaughtered: "",
    condemnedCount: "",
    reason: "",
  });

  const [processingBatches, setProcessingBatches] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch processing batches for linking
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${baseUrl}processing-batches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProcessingBatches(response.data.content);
      } catch (error) {
        console.error("Error fetching processing batches:", error);
        toast.error("Could not load processing batches");
      }
    };
    fetchBatches();
  }, [token]);

  // Fetch slaughter log if editing
  useEffect(() => {
    if (id) {
      const fetchLog = async () => {
        try {
          const response = await axios.get(`${baseUrl}slaughter-logs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLog(response.data);
        } catch (error) {
          console.error("Error fetching slaughter log:", error);
          toast.error("Could not load slaughter log details.");
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
        await axios.post(`${baseUrl}slaughter-logs`, log, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
      toast.success(id ? "Slaughter log updated successfully!" : "Slaughter log created successfully!");
      navigate("/dashboard/slaughter-logs");
    } catch (error) {
      console.error("Error saving slaughter log:", error);
      toast.error(error.response?.data?.message || "Error saving slaughter log.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Slaughter Log" : "Add Slaughter Log"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Processing Batch:</label>
                <select
                  name="processId"
                  value={log.processId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Processing Batch --</option>
                  {processingBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                     {batch.date} / {batch.plantLocation} - {batch.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Birds Received:</label>
                <input
                  type="number"
                  name="birdsReceived"
                  value={log.birdsReceived || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Birds Slaughtered:</label>
                <input
                  type="number"
                  name="birdsSlaughtered"
                  value={log.birdsSlaughtered || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Condemned Count:</label>
                <input
                  type="number"
                  name="condemnedCount"
                  value={log.condemnedCount || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Reason for Condemnation:</label>
                <textarea
                  name="reason"
                  value={log.reason || ""}
                  onChange={handleChange}
                  placeholder="Enter reason (e.g. sickness, injury, quality)"
                  rows={3}
                  required
                />
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

export default AddSlaughterLog;
