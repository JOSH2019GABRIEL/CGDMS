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
    id: "",
    date: "",
    flockId: "",
    vaccineName: "",
    dose: "",
    route: "",
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
          const response = await axios.get(`${baseUrl}vaccination-logs/${id}`, {
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
  }, [token]);

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
        await axios.post(`${baseUrl}vaccination-logs`, log, {
          headers: { Authorization: `Bearer ${token}` },
        });

      toast.success(
        id
          ? "Vaccination log updated successfully!"
          : "Vaccination log created successfully!"
      );
      setTimeout(() => {
      navigate("/dashboard/broiler-vaccination-log");
      }, 1000);
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
                    <option key={flock.id} value={flock.id}>
                      {flock.id} - {flock.source}
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
                <select
                  name="route"
                  value={log.route || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Vaccination Route --</option>
                  <option value="Oral (Drinking Water)">
                    Oral (Drinking Water)
                  </option>
                  <option value="Spray">Spray</option>
                  <option value="Eye Drop">Eye Drop</option>
                  <option value="Nasal Drop">Nasal Drop</option>
                  <option value="Subcutaneous (Under Skin)">
                    Subcutaneous (Under Skin)
                  </option>
                  <option value="Intramuscular (In the Muscle)">
                    Intramuscular (In the Muscle)
                  </option>
                  <option value="Wing Web">Wing Web</option>
                </select>
              </div>

              <div className="formInput">
               
                <input
                  hidden
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
