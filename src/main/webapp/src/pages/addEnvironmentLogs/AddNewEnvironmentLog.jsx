import "../../style/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddMedicationLog = () => {
  const [medicationLog, setMedicationLog] = useState({
    id: "",
    treatmentDate: "",
    pondId: "",
    diagnosis: "",
    medication: "",
    dosage: "",
    dosageUnit: "",
    quantityUsed: "",
    method: "",
    notes: "",
    withdrawalDays: "",
  });

  const [ponds, setPonds] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch ponds for dropdown
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

  // Fetch medication log if editing
  useEffect(() => {
    if (id) {
      const fetchMedicationLog = async () => {
        try {
          const response = await axios.get(`${baseUrl}medication-logs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMedicationLog(response.data);
        } catch (error) {
          console.error("Error fetching medication log:", error);
          toast.error("Could not load medication log");
        }
      };
      fetchMedicationLog();
    }
  }, [id, token]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicationLog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}medication-logs/${id}`, medicationLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Medication log updated successfully!");
      } else {
        await axios.post(`${baseUrl}medication-logs`, medicationLog, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Medication log submitted successfully!");
      }

      navigate("/dashboard/medication-logs");
    } catch (error) {
      console.error("Error saving medication log:", error);
      toast.error(
        error.response?.data?.message || "Error saving medication log."
      );
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Medication Log" : "Add Medication Log"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Treatment Date:</label>
                <input
                  type="date"
                  name="treatmentDate"
                  value={medicationLog.treatmentDate || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Pond:</label>
                <select
                  name="pondId"
                  value={medicationLog.pondId || ""}
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
                <label>Diagnosis:</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={medicationLog.diagnosis || ""}
                  onChange={handleChange}
                  placeholder="Enter diagnosis"
                  required
                />
              </div>

              <div className="formInput">
                <label>Medication:</label>
                <input
                  type="text"
                  name="medication"
                  value={medicationLog.medication || ""}
                  onChange={handleChange}
                  placeholder="Enter medication name"
                  required
                />
              </div>

              <div className="formInput">
                <label>Dosage:</label>
                <input
                  type="number"
                  name="dosage"
                  value={medicationLog.dosage || ""}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="e.g., 0.5"
                  required
                />
              </div>

              <div className="formInput">
                <label>Dosage Unit:</label>
                <input
                  type="text"
                  name="dosageUnit"
                  value={medicationLog.dosageUnit || ""}
                  onChange={handleChange}
                  placeholder="e.g., mg/kg"
                  required
                />
              </div>

              <div className="formInput">
                <label>Quantity Used:</label>
                <input
                  type="number"
                  name="quantityUsed"
                  value={medicationLog.quantityUsed || ""}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Enter total quantity used"
                  required
                />
              </div>

              <div className="formInput">
                <label>Method:</label>
                <select
                  name="method"
                  value={medicationLog.method || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Method --</option>
                  <option value="BATH">Bath</option>
                  <option value="FEED">Feed</option>
                  <option value="INJECTION">Injection</option>
                  <option value="WATER">Water</option>
                </select>
              </div>

              <div className="formInput">
                <label>Withdrawal Days:</label>
                <input
                  type="number"
                  name="withdrawalDays"
                  value={medicationLog.withdrawalDays || ""}
                  onChange={handleChange}
                  placeholder="e.g., 7"
                />
              </div>

              <div className="formInput">
                <label>Notes:</label>
                <textarea
                  name="notes"
                  value={medicationLog.notes || ""}
                  onChange={handleChange}
                  placeholder="Additional notes..."
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

export default AddMedicationLog;
