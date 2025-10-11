import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddCutupYield = () => {
  const { id } = useParams();
  const [yieldData, setYieldData] = useState({
    id: "",
    processingBatchId: "",
    wholeBirdsCount: "",
    breastKg: "",
    thighKg: "",
    wingKg: "",
    drumstickKg: "",
    carcassKg: "",
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

  // Fetch cutup yield if editing
  useEffect(() => {
    if (id) {
      const fetchYield = async () => {
        try {
          const response = await axios.get(`${baseUrl}cutup-yields/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setYieldData(response.data);
        } catch (error) {
          console.error("Error fetching cut-up yield:", error);
          toast.error("Could not load cut-up yield details.");
        }
      };
      fetchYield();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setYieldData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post(`${baseUrl}cutup-yields`, yieldData, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
      toast.success(id ? "Cut-up yield updated successfully!" : "Cut-up yield created successfully!");
      setTimeout(() => {
      navigate("/dashboard/cutup-yields");
      }, 1000);
    } catch (error) {
      console.error("Error saving cut-up yield:", error);
      toast.error(error.response?.data?.message || "Error saving cut-up yield.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Cut-up Yield" : "Add Cut-up Yield"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Processing Batch:</label>
                <select
                  name="processingBatchId"
                  value={yieldData.processingBatchId}
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
                <label>Whole Birds Count:</label>
                <input
                  type="number"
                  name="wholeBirdsCount"
                  value={yieldData.wholeBirdsCount || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Breast (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="breastKg"
                  value={yieldData.breastKg || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Thigh (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="thighKg"
                  value={yieldData.thighKg || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Wing (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="wingKg"
                  value={yieldData.wingKg || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Drumstick (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="drumstickKg"
                  value={yieldData.drumstickKg || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Carcass (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="carcassKg"
                  value={yieldData.carcassKg || ""}
                  onChange={handleChange}
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

export default AddCutupYield;
