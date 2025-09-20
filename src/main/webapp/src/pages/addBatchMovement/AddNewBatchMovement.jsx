import "../../style/new.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewBatchMovement = () => {
  const { id } = useParams(); // detect edit mode
  const [newMovement, setNewMovement] = useState({
    id: "",
    batchId: "",
    fromPondId: "",
    toPondId: "",
    movementDate: "",
    movedCount: "",
    reason: "",
  });

  const [ponds, setPonds] = useState([]);
  const [batch, setBatch] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // fetch ponds
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

  // fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${baseUrl}batch`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatch(response.data.content);
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast.error("Could not load batches");
      }
    };
    fetchBatches();
  }, [token]);

  // fetch movement if editing
  useEffect(() => {
    if (id) {
      const fetchMovement = async () => {
        try {
          const response = await axios.get(`${baseUrl}batch-movements/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewMovement(response.data);
        } catch (error) {
          console.error("Error fetching movement:", error);
          toast.error("Could not load movement details.");
        }
      };
      fetchMovement();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMovement((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newMovement.fromPondId === newMovement.toPondId) {
      toast.error("Source and Destination ponds cannot be the same!");
      return;
    }

    try {
      await axios.post(`${baseUrl}batch-movements`, newMovement, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(id ? "Movement updated successfully!" : "Movement created successfully!");
      navigate("/dashboard/batch-movement");
    } catch (error) {
      console.error("Error saving movement:", error);
      toast.error(error.response?.data?.message || "Error saving batch movement.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Batch Movement" : "Add Batch Movement"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Batch:</label>
                <select
                  name="batchId"
                  value={newMovement.batchId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Batch --</option>
                  {batch.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>From Pond:</label>
                <select
                  name="fromPondId"
                  value={newMovement.fromPondId}
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
                <label>To Pond:</label>
                <select
                  name="toPondId"
                  value={newMovement.toPondId}
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
                <label>Movement Date:</label>
                <input
                  type="date"
                  name="movementDate"
                  value={newMovement.movementDate || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Moved Count:</label>
                <input
                  type="number"
                  name="movedCount"
                  value={newMovement.movedCount || ""}
                  onChange={handleChange}
                  placeholder="Enter number of fish moved"
                  required
                />
              </div>

              <div className="formInput">
                <label>Reason:</label>
                <input
                  type="text"
                  name="reason"
                  value={newMovement.reason || ""}
                  onChange={handleChange}
                  placeholder="Reason for movement"
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

export default AddNewBatchMovement;