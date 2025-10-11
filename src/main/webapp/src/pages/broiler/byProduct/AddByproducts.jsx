import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddByproducts = () => {
  const { id } = useParams();
  const [byproductData, setByproductData] = useState({
    id: "",
    processingBatchId: "",
    liverKg: "",
    gizzardKg: "",
    heartKg: "",
    bloodLtr: "",
    feathersKg: "",
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

  // Fetch byproduct if editing
  useEffect(() => {
    if (id) {
      const fetchByproduct = async () => {
        try {
          const response = await axios.get(`${baseUrl}byproducts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setByproductData(response.data);
        } catch (error) {
          console.error("Error fetching byproducts:", error);
          toast.error("Could not load byproduct details.");
        }
      };
      fetchByproduct();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setByproductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post(`${baseUrl}byproducts`, byproductData, {
          headers: { Authorization: `Bearer ${token}` },
        });
    

      toast.success(id ? "Byproducts updated successfully!" : "Byproducts recorded successfully!");
      setTimeout(() => {
      navigate("/dashboard/by-products");
      }, 1000);
    } catch (error) {
      console.error("Error saving byproducts:", error);
      toast.error(error.response?.data?.message || "Error saving byproducts.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Byproducts" : "Add Byproducts"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Processing Batch:</label>
                <select
                  name="processingBatchId"
                  value={byproductData.processingBatchId}
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
                <label>Liver (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="liverKg"
                  value={byproductData.liverKg || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Gizzard (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="gizzardKg"
                  value={byproductData.gizzardKg || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Heart (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="heartKg"
                  value={byproductData.heartKg || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Blood (litres):</label>
                <input
                  type="number"
                  step="0.01"
                  name="bloodLtr"
                  value={byproductData.bloodLtr || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Feathers (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="feathersKg"
                  value={byproductData.feathersKg || ""}
                  onChange={handleChange}
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

export default AddByproducts;
