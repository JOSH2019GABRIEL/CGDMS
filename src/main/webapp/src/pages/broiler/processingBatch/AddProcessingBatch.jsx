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
    id: "",
    harvestEventId: "",
    date: "",
    plantLocation: "",
  });

  const [harvestEvents, setHarvestEvents] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch harvest events
  useEffect(() => {
    const fetchHarvestEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}harvest-events`, {
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

  // Fetch batch if editing
  useEffect(() => {
    if (id) {
      const fetchBatch = async () => {
        try {
          const response = await axios.get(`${baseUrl}processing-batches/${id}`, {
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
        await axios.post(`${baseUrl}processing-batches`, batch, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

export default AddProcessingBatch;
