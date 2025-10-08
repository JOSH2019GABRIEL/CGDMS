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
    id: "",
    processId: "",
    inedibleWasteKg: "",
    packagingWasteKg: "",
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
      await axios.post(`${baseUrl}wastes`, wasteData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        id
          ? "Waste record updated successfully!"
          : "Waste record created successfully!"
      );
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
                    <option key={batch.id} value={batch.id}>
                      {batch.date} / {batch.plantLocation} - {batch.id}
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
                <select
                  name="disposalMethod"
                  value={wasteData.disposalMethod || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Disposal Method --</option>
                  <option value="Incineration">Incineration</option>
                  <option value="Composting">Composting</option>
                  <option value="Landfill">Landfill</option>
                  <option value="Recycling">Recycling</option>
                  <option value="Burial">Burial</option>
                  <option value="Rendering">Rendering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="formInput">
                <input hidden />
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
