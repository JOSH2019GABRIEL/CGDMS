import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate } from "react-router-dom";

const AddNewBatch = () => {
  const [newBatch, setNewBatch] = useState({
    pondId: "",
    source: "",
    stockDate: "",
    initialAvgWeightG: "",
    initialCount: "",
  });

  const [ponds, setPonds] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBatch((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}batch`, newBatch, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Batch submitted successfully:", response.data);
      toast.success("Submitted successfully!");

      setNewBatch({
        pondId: "",
        source: "",
        stockDate: "",
        initialAvgWeightG: "",
        initialCount: "",
      });
        navigate("/dashboard/batches");
    } catch (error) {
      console.error("Error adding batch:", error);
      toast.error(error.response?.data?.message || "Error adding batch.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add Batch</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleAddBatch}>
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
                  value={newBatch.source}
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
                  value={newBatch.stockDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Initial Average Weight (g):</label>
                <input
                  type="number"
                  name="initialAvgWeightG"
                  value={newBatch.initialAvgWeightG}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Total Count:</label>
                <input
                  type="number"
                  name="initialCount"
                  value={newBatch.initialCount}
                  onChange={handleChange}
                  required
                />
              </div>
               <div className="formInput">
                
               </div>

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddNewBatch;
