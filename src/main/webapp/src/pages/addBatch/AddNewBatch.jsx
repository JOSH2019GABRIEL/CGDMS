import "../../style/new.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewBatch = () => {
  const { id } = useParams();
  const [newBatch, setNewBatch] = useState({
    id: "",
    pondId: "",
    source: "",
    stockDate: "",
    initialAvgWeightG: "",
    initialCount: "",
  });

  const [ponds, setPonds] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch ponds
  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const response = await axios.get(`${baseUrl}ponds`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPonds(response.data.content);
      } catch (error) {
        console.error("Error fetching ponds:", error);
        toast.error("Could not load ponds");
      }
    };
    fetchPonds();
  }, [token]);

  // Fetch batch details if editing
  useEffect(() => {
    if (id) {
      const fetchBatch = async () => {
        try {
          const response = await axios.get(`${baseUrl}batch/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewBatch(response.data); // prefill form
        } catch (error) {
          console.error("Error fetching batch:", error);
          toast.error("Could not load batch details.");
        }
      };
      fetchBatch();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBatch((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}batch`, newBatch, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(id ? "Batch updated successfully!" : "Batch created successfully!");
      navigate("/dashboard/batches");
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
          <h1>{id ? "Edit Batch" : "Add Batch"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Pond:</label>
                <select
                  name="pondId"
                  value={newBatch.pondId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Pond --</option>
                  {ponds.map((pond) => (
                    <option key={pond.id} value={pond.id}>
                      {pond.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Batch Source:</label>
                <input
                  type="text"
                  name="source"
                  value={newBatch.source || ""}
                  onChange={handleChange}
                  placeholder="Enter source"
                  required
                />
              </div>

              <div className="formInput">
                <label>Stock Date:</label>
                <input
                  type="date"
                  name="stockDate"
                  value={newBatch.stockDate || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Initial Average Weight (g):</label>
                <input
                  type="number"
                  name="initialAvgWeightG"
                  value={newBatch.initialAvgWeightG || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Total Count:</label>
                <input
                  type="number"
                  name="initialCount"
                  value={newBatch.initialCount || ""}
                  onChange={handleChange}
                  required
                />
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

export default AddNewBatch;
