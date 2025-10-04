import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddProcessingBatch = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState({
    processId: "",
    harvestEventId: "",
    date: "",
    plantLocation: "",
    operatorId: "",
  });

  const [harvestEvents, setHarvestEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch harvest events
  useEffect(() => {
    const fetchHarvestEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}harvestEvents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHarvestEvents(response.data.content);
      } catch (error) {
        console.error("Error fetching harvest events:", error);
        toast.error("Could not load harvest events");
      }
    };
    fetchHarvestEvents();
  }, [token]);

  // Fetch staff/operators
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${baseUrl}staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(response.data.content);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error("Could not load operators");
      }
    };
    fetchStaff();
  }, [token]);

  // Fetch batch if editing
  useEffect(() => {
    if (id) {
      const fetchBatch = async () => {
        try {
          const response = await axios.get(`${baseUrl}processingBatch/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBatch(response.data);
        } catch (error) {
          console.error("Error fetching processing batch:", error);
          toast.error("Could not load processing batch details.");
        }
      };
      fetchBatch();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatch((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}processingBatch/${id}`, batch, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${baseUrl}processingBatch`, batch, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success(id ? "Processing batch updated successfully!" : "Processing batch created successfully!");
      navigate("/dashboard/processing-batches");
    } catch (error) {
      console.error("Error saving batch:", error);
      toast.error(error.response?.data?.message || "Error saving batch.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Processing Batch" : "Add Processing Batch"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Process ID:</label>
                <input
                  type="text"
                  name="processId"
                  value={batch.processId || ""}
                  onChange={handleChange}
                  placeholder="Enter unique process ID"
                  required
                />
              </div>

              <div className="formInput">
                <label>Harvest Event:</label>
                <select
                  name="harvestEventId"
                  value={batch.harvestEventId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Harvest Event --</option>
                  {harvestEvents.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.date} - {h.flockId} (Harvested: {h.totalHarvested})
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={batch.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Plant Location:</label>
                <input
                  type="text"
                  name="plantLocation"
                  value={batch.plantLocation || ""}
                  onChange={handleChange}
                  placeholder="e.g. Processing Plant A"
                  required
                />
              </div>

              <div className="formInput">
                <label>Operator:</label>
                <select
                  name="operatorId"
                  value={batch.operatorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Operator --</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
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

export default AddProcessingBatch;
