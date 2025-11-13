import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddSmokingTransfer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [postHarvests, setPostHarvests] = useState([]);

  const [smokingTransfer, setSmokingTransfer] = useState({
    id: "",
    postHarvestId: "",
    smokingBatchId: "",
    quantityReceivedKg: "",
    processingLossKg: "",
    smokedOutputKg: "",
    transferNoteNo: "",
    qcInspectionStatus: "",
  });

  // Function to generate smoking batch ID
  const generateSmokingBatchId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SMK-${timestamp}-${random}`;
  };

  // Alternative: More readable format
  const generateReadableBatchId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SMK-${year}${month}${day}-${random}`;
  };

  // Generate ID on mount (only for new records, not when editing)
  useEffect(() => {
    if (!id) {
      setSmokingTransfer((prev) => ({
        ...prev,
        smokingBatchId: generateReadableBatchId()
      }));
    }
  }, [id]);

  useEffect(() => {
    const fetchPostHarvests = async () => {
      try {
        const response = await axios.get(`${baseUrl}fish-post-harvest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPostHarvests(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching post-harvest list:", error);
        toast.error("Could not load post-harvest list.");
      }
    };
    fetchPostHarvests();
  }, [token]);

  useEffect(() => {
    if (id) {
      const fetchSmokingTransfer = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}smoking-plant/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSmokingTransfer(response.data);
        } catch (error) {
          console.error("Error fetching smoking transfer details:", error);
          toast.error("Could not load record details.");
        }
      };
      fetchSmokingTransfer();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSmokingTransfer((prevState) => {
      const updated = { ...prevState, [name]: value };

      if (name === "quantityReceivedKg" || name === "processingLossKg") {
        const received = parseFloat(
          name === "quantityReceivedKg" ? value : prevState.quantityReceivedKg
        );
        const loss = parseFloat(
          name === "processingLossKg" ? value : prevState.processingLossKg
        );

        if (!isNaN(received) && !isNaN(loss)) {
          updated.smokedOutputKg = Math.max(received - loss, 0).toFixed(2);
        } else {
          updated.smokedOutputKg = "";
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post(`${baseUrl}smoking-plant`, smokingTransfer, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(id ? "Smoking transfer record updated successfully!" : "Smoking transfer record added successfully!");

      setTimeout(() => {
        navigate("/dashboard/smoking-plants");
      }, 1000);
    } catch (error) {
      console.error("Error saving smoking transfer:", error);
      toast.error(
        error.response?.data?.message || "Error saving smoking transfer record."
      );
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{id ? "Edit Smoking Transfer" : "Add Smoking Transfer"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Smoking Batch ID */}
              <div className="formInput">
                <label>Smoking Batch ID:</label>
                <input
                  type="text"
                  name="smokingBatchId"
                  value={smokingTransfer.smokingBatchId || ""}
                  onChange={handleChange}
                  placeholder="Auto-generated"
                  readOnly
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
              </div>

              {/* Quantity Received */}
              <div className="formInput">
                <label>Quantity Received (Kg):</label>
                <input
                  type="number"
                  name="quantityReceivedKg"
                  value={smokingTransfer.quantityReceivedKg || ""}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Enter quantity received"
                  required
                />
              </div>

              {/* Processing Loss */}
              <div className="formInput">
                <label>Processing Loss (Kg):</label>
                <input
                  type="number"
                  name="processingLossKg"
                  value={smokingTransfer.processingLossKg || ""}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Enter processing loss"
                  required
                />
              </div>

              {/* Smoked Output */}
              <div className="formInput">
                <label>Smoked Output (Kg):</label>
                <input
                  type="number"
                  name="smokedOutputKg"
                  value={smokingTransfer.smokedOutputKg || ""}
                  readOnly
                  step="0.01"
                  placeholder="Auto-calculated"
                />
              </div>

              <div className="formInput">
                <label>Transfer Note No:</label>
                <input
                  type="text"
                  name="transferNoteNo"
                  value={smokingTransfer.transferNoteNo || ""}
                  onChange={handleChange}
                  placeholder="Enter transfer note number"
                  required
                />
              </div>

              <div className="formInput">
                <label>QC Inspection Status:</label>
                <select
                  name="qcInspectionStatus"
                  value={smokingTransfer.qcInspectionStatus || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Status --</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Post Harvest Selection */}
              <div className="formInput">
                <label>Post Harvest Record:</label>
                <select
                  name="postHarvestId"
                  value={smokingTransfer.postHarvestId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Post-Harvest --</option>
                  {postHarvests.map((ph) => (
                    <option key={ph.id} value={ph.id}>
                      {ph.destinationBatchNo} - {ph.destinationType} (ID: {ph.id})
                    </option>
                  ))}
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

export default AddSmokingTransfer;