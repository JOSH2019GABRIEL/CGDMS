import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddWaste = () => {
  const { id } = useParams();
  const [wasteData, setWasteData] = useState({
    processId: "",
    inedibleKg: "",
    packagingKg: "",
    effluentEstimateKg: "",
    disposalMethod: "",
  });

  const [processingBatches, setProcessingBatches] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch processing batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${baseUrl}processingBatch`, {
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

  // Fetch waste if editing
  useEffect(() => {
    if (id) {
      const fetchWaste = async () => {
        try {
          const response = await axios.get(`${baseUrl}wastes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWasteData(response.data);
        } catch (error) {
          console.error("Error fetching waste record:", error);
          toast.error("Could not load waste details.");
        }
      };
      fetchWaste();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWasteData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}wastes/${id}`, wasteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${baseUrl}wastes`, wasteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success(id ? "Waste record updated successfully!" : "Waste record created successfully!");
      navigate("/dashboard/wastes");
    } catch (error) {
      console.error("Error saving waste:", error);
      toast.error(error.response?.data?.message || "Error saving waste.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Waste Record" : "Add Waste Record"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Processing Batch:</label>
                <select
                  name="processId"
                  value={wasteData.processId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Processing Batch --</option>
                  {processingBatches.map((batch) => (
                    <option key={batch.id} value={batch.processId}>
                      {batch.processId} - {batch.plantLocation} ({batch.date})
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Inedible Waste (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="inedibleKg"
                  value={wasteData.inedibleKg || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Packaging Waste (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="packagingKg"
                  value={wasteData.packagingKg || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Effluent Estimate (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="effluentEstimateKg"
                  value={wasteData.effluentEstimateKg || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Disposal Method:</label>
                <input
                  type="text"
                  name="disposalMethod"
                  value={wasteData.disposalMethod || ""}
                  onChange={handleChange}
                  placeholder="e.g. incineration, composting, landfill"
                  required
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

export default AddWaste;
