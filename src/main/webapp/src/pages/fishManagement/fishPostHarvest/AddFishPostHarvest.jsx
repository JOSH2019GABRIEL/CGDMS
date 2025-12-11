import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import { generateReadableBatchId } from "../../../pages/util/generateReadableBatchId";

const AddFishPostHarvest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [harvests, setHarvests] = useState([]);
  const [postHarvest, setPostHarvest] = useState({
    id: "",
    destinationType: "",
    quantityToLiveSaleKg: "",
    quantityToSmokingKg: "",
    destinationBatchNo: "",
    transferDate: "",
    harvestId: "",
    postHarvestBatchId: "", 
  });

  // ✅ Fetch all harvests for dropdown
  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        const response = await axios.get(`${baseUrl}fish-harvest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHarvests(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching harvests:", error);
        toast.error("Could not load harvest list.");
      }
    };
    fetchHarvests();
  }, [token]);

  // ✅ Fetch post-harvest details if editing
  useEffect(() => {
    if (id) {
      const fetchPostHarvest = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}fish-post-harvest/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setPostHarvest(response.data);
        } catch (error) {
          console.error("Error fetching post-harvest details:", error);
          toast.error("Could not load record details.");
        }
      };
      fetchPostHarvest();
    }
  }, [id, token]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostHarvest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
      if (!id) {
        setPostHarvest((prev) => ({
          ...prev,
          postHarvestBatchId: generateReadableBatchId("FPH")
        }));
      }
    }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}fish-post-harvest`, postHarvest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        id
          ? "Fish post-harvest record updated successfully!"
          : "Fish post-harvest record added successfully!"
      );
      setTimeout(() => {
        navigate("/dashboard/fish-post-harvests");
      }, 1000);
    } catch (error) {
      console.error("Error saving post harvest:", error);
      toast.error(error.response?.data?.message || "Error saving post harvest.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>
            {id
              ? "Edit Fish Post-Harvest Record"
              : "Add Fish Post-Harvest Record"}
          </h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Batch ID:</label>
                <input
                  type="text"
                  name="postHarvestBatchId"
                  value={postHarvest.postHarvestBatchId || ""}
                  onChange={handleChange}
                  placeholder="Auto-generated"
                  readOnly
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
              </div>

             <div className="formInput">
                <label>Destination Type:</label>
                <select
                  name="destinationType"
                  value={postHarvest.destinationType || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Status --</option>
                  <option value="Market">Market</option>
                  <option value="Processing">Processing</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              
              <div className="formInput">
                <label>Quantity to Live Sale (g):</label>
                <input
                  type="number"
                  name="quantityToLiveSaleKg"
                  value={postHarvest.quantityToLiveSaleKg || ""}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="formInput">
                <label>Quantity to Smoking (g):</label>
                <input
                  type="number"
                  name="quantityToSmokingKg"
                  value={postHarvest.quantityToSmokingKg || ""}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="formInput">
                <label>Destination Batch No:</label>
                <input
                  type="text"
                  name="destinationBatchNo"
                  value={postHarvest.destinationBatchNo || ""}
                  onChange={handleChange}
                  placeholder="Enter destination batch number"
                  required
                />
              </div>

              <div className="formInput">
                <label>Transfer Date:</label>
                <input
                  type="date"
                  name="transferDate"
                  value={postHarvest.transferDate || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Harvest Record:</label>
                <select
                  name="harvestId"
                  value={postHarvest.harvestId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Harvest --</option>
                  {harvests.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.harvestBatchId} - (Total Harvested: {h.totalFishHarvested})
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <input hidden/>
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

export default AddFishPostHarvest;
