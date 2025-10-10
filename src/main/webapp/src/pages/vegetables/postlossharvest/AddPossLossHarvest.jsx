import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddPostLossHarvest = () => {
  const { id } = useParams();
  const [harvestBatches, setHarvestBatches] = useState([]);
  const [postLoss, setPostLoss] = useState({
    id: "",
    spoilageKg: "",
    trimmingWasteKg: "",
    pestsDamageKg: "",
    harvestBatchId: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch harvest batches
  useEffect(() => {
    const fetchHarvestBatches = async () => {
      try {
        const response = await axios.get(`${baseUrl}harvest-batches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHarvestBatches(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching harvest batches:", error);
        toast.error("Could not load harvest batches.");
      }
    };
    fetchHarvestBatches();
  }, [token]);

  // ✅ Fetch PostLossHarvest if editing
  useEffect(() => {
    if (id) {
      const fetchPostLossHarvest = async () => {
        try {
          const response = await axios.get(`${baseUrl}postloss-harvest/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPostLoss(response.data);
        } catch (error) {
          console.error("Error fetching post-loss harvest record:", error);
          toast.error("Could not load post-loss harvest details.");
        }
      };
      fetchPostLossHarvest();
    }
  }, [token]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostLoss((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${baseUrl}postharvest-losses`, postLoss, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(id ? "Post-loss harvest updated successfully!" : "Post-loss harvest created successfully!");
      navigate("/dashboard/postloss-harvestes");
    } catch (error) {
      console.error("Error saving post-loss harvest:", error);
      toast.error(error.response?.data?.message || "Error saving record.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Post-Loss Harvest" : "Add Post-Loss Harvest"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Harvest Batch */}
              <div className="formInput">
                <label>Harvest Batch:</label>
                <select
                  name="harvestBatchId"
                  value={postLoss.harvestBatchId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Harvest Batch --</option>
                  {harvestBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.date
                        ? `${batch.date} - Batch ${batch.id}`
                        : `Batch ${batch.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Spoilage */}
              <div className="formInput">
                <label>Spoilage (Kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="spoilageKg"
                  value={postLoss.spoilageKg || ""}
                  onChange={handleChange}
                  placeholder="Enter spoilage weight"
                  required
                />
              </div>

              {/* Trimming Waste */}
              <div className="formInput">
                <label>Trimming Waste (Kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="trimmingWasteKg"
                  value={postLoss.trimmingWasteKg || ""}
                  onChange={handleChange}
                  placeholder="Enter trimming waste"
                  required
                />
              </div>

              {/* Pests Damage */}
              <div className="formInput">
                <label>Pests Damage (Kg):</label>
                <input
                  type="number"
                  step="0.01"
                  name="pestsDamageKg"
                  value={postLoss.pestsDamageKg || ""}
                  onChange={handleChange}
                  placeholder="Enter pests damage"
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

export default AddPostLossHarvest;
