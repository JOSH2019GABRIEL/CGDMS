import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddWeightSample = () => {
  const { id } = useParams();
  const [sample, setSample] = useState({
    date: "",
    flockId: "",
    sampleCount: "",
    avgWeightG: "",
    sd: "",
    operator: "",
  });

  const [flocks, setFlocks] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch flocks
  useEffect(() => {
    const fetchFlocks = async () => {
      try {
        const response = await axios.get(`${baseUrl}flocks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlocks(response.data.content);
      } catch (error) {
        console.error("Error fetching flocks:", error);
        toast.error("Could not load flocks");
      }
    };
    fetchFlocks();
  }, [token]);

  // Fetch sample if editing
  useEffect(() => {
    if (id) {
      const fetchSample = async () => {
        try {
          const response = await axios.get(`${baseUrl}weight-samples/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSample(response.data); // prefill form
        } catch (error) {
          console.error("Error fetching sample:", error);
          toast.error("Could not load sample details.");
        }
      };
      fetchSample();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSample((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
        await axios.post(`${baseUrl}weight-samples`, sample, {
          headers: { Authorization: `Bearer ${token}` },
        });
      

      toast.success(id ? "Weight sample updated successfully!" : "Weight sample created successfully!");
      navigate("/dashboard/weight-sample");
    } catch (error) {
      console.error("Error saving sample:", error);
      toast.error(error.response?.data?.message || "Error saving sample.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Weight Sample" : "Add Weight Sample"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={sample.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Flock:</label>
                <select
                  name="flockId"
                  value={sample.flockId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Flock --</option>
                  {flocks.map((flock) => (
                    <option key={flock.id} value={flock.id}>
                      {flock.id} - {flock.source}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Sample Count:</label>
                <input
                  type="number"
                  name="sampleCount"
                  value={sample.sampleCount || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Average Weight (g):</label>
                <input
                  type="number"
                  step="0.01"
                  name="avgWeightG"
                  value={sample.avgWeightG || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Standard Deviation:</label>
                <input
                  type="number"
                  step="0.01"
                  name="sd"
                  value={sample.sd || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formInput">
                <label>Operator:</label>
                <input
                  type="text"
                  name="operator"
                  value={sample.operator || ""}
                  onChange={handleChange}
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

export default AddWeightSample;
