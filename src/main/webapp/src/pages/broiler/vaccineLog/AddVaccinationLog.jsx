import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddVaccinationLog = () => {
  const { id } = useParams();
  const [log, setLog] = useState({
    date: "",
    flockId: "",
    vaccineName: "",
    dose: "",
    route: "",
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

  // Fetch vaccination log if editing
  useEffect(() => {
    if (id) {
      const fetchLog = async () => {
        try {
          const response = await axios.get(`${baseUrl}vaccinationLog/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLog(response.data); // prefill form
        } catch (error) {
          console.error("Error fetching log:", error);
          toast.error("Could not load vaccination log details.");
        }
      };
      fetchLog();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}vaccinationLog/${id}`, log, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${baseUrl}vaccinationLog`, log, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success(id ? "Vaccination log updated successfully!" : "Vaccination log created successfully!");
      navigate("/dashboard/vaccination-logs");
    } catch (error) {
      console.error("Error saving log:", error);
      toast.error(error.response?.data?.message || "Error saving log.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Vaccination Log" : "Add Vaccination Log"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={log.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Flock:</label>
                <select
                  name="flockId"
                  value={log.flockId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Flock --</option>
                  {flocks.map((flock) => (
                    <option key={flock.flock_id} value={flock.flock_id}>
                      {flock.flock_id} - {flock.source}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Vaccine Name:</label>
                <input
                  type="text"
                  name="vaccineName"
                  value={log.vaccineName || ""}
                  onChange={handleChange}
                  placeholder="e.g. NDV, Gumboro"
                  required
                />
              </div>

              <div className="formInput">
                <label>Dose:</label>
                <input
                  type="text"
                  name="dose"
                  value={log.dose || ""}
                  onChange={handleChange}
                  placeholder="e.g. 0.5ml/bird"
                  required
                />
              </div>

              <div className="formInput">
                <label>Route:</label>
                <input
                  type="text"
                  name="route"
                  value={log.route || ""}
                  onChange={handleChange}
                  placeholder="e.g. Oral, Subcutaneous, Eye drop"
                  required
                />
              </div>

              <div className="formInput">
                <label>Operator:</label>
                <input
                  type="text"
                  name="operator"
                  value={log.operator || ""}
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

export default AddVaccinationLog;
