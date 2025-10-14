import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddHarvestBatch = () => {
  const { id } = useParams();
  const [plots, setPlots] = useState([]);
  const [harvestBatch, setHarvestBatch] = useState({
    id: "",
    date: "",
    harvestedQtyKg: "",
    marketGrade: "",
    packedQtyKg: "",
    packType: "",
    plotId: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch plots
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axios.get(`${baseUrl}plot`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlots(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching plots:", error);
        toast.error("Could not load plots.");
      }
    };
    fetchPlots();
  }, [token]);

  // ✅ Fetch harvest batch if editing
  useEffect(() => {
    if (id) {
      const fetchHarvestBatch = async () => {
        try {
          const response = await axios.get(`${baseUrl}harvest-batches/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHarvestBatch(response.data);
        } catch (error) {
          console.error("Error fetching harvest batch:", error);
          toast.error("Could not load harvest batch details.");
        }
      };
      fetchHarvestBatch();
    }
  }, [id, token]);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHarvestBatch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}harvest-batches`, harvestBatch, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(
        id
          ? "Harvest batch updated successfully!"
          : "Harvest batch created successfully!"
      );
      setTimeout(() => {
        navigate("/dashboard/harvest-batches");
      }, 1000);
    } catch (error) {
      console.error("Error saving harvest batch:", error);
      setTimeout(() => {
        toast.error(
          error.response?.data?.message || "Error saving harvest batch."
        );
      }, 1000);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Harvest Batch" : "Add Harvest Batch"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Date */}
              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={harvestBatch.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Plot */}
              <div className="formInput">
                <label>Plot:</label>
                <select
                  name="plotId"
                  value={harvestBatch.plotId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Plot --</option>
                  {plots.map((plot) => (
                    <option key={plot.id} value={plot.id}>
                      {plot.name || `Plot ${plot.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Harvested Quantity */}
              <div className="formInput">
                <label>Harvested Quantity (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="harvestedQtyKg"
                  value={harvestBatch.harvestedQtyKg || ""}
                  onChange={handleChange}
                  placeholder="Enter harvested quantity"
                  required
                />
              </div>

              {/* Market Grade */}
              <div className="formInput">
                <label>Market Grade:</label>
                <select
                  name="marketGrade"
                  value={harvestBatch.marketGrade || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Grade --</option>
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Reject)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Packed Quantity */}
              <div className="formInput">
                <label>Packed Quantity (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="packedQtyKg"
                  value={harvestBatch.packedQtyKg || ""}
                  onChange={handleChange}
                  placeholder="Enter packed quantity"
                />
              </div>

              {/* Pack Type */}
              <div className="formInput">
                <label>Pack Type:</label>
                <select
                  name="packType"
                  value={harvestBatch.packType || ""}
                  onChange={handleChange}
                >
                  <option value="">-- Select Pack Type --</option>
                  <option value="Crate">Crate</option>
                  <option value="Bag">Bag</option>
                  <option value="Box">Box</option>
                  <option value="Basket">Basket</option>
                  <option value="Other">Other</option>
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

export default AddHarvestBatch;
