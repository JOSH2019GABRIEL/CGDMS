import "../../style/new.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewCadre = () => {
  const { id } = useParams();
  const [cadreData, setCadreData] = useState({
    id: "",
    cadreName: "",
    paymentType: "",
    rate: "",
    description: "",
    farmId: "",
  });

  const [farms, setFarms] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch farms for selection
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(`${baseUrl}farms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarms(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
        toast.error("Could not load farms");
      }
    };
    fetchFarms();
  }, [token]);

  // Fetch cadre record if editing
  useEffect(() => {
    if (id) {
      const fetchCadre = async () => {
        try {
          const response = await axios.get(`${baseUrl}cadres/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const cadreRecords = response.data.data || response.data;
          setCadreData(cadreRecords);
        } catch (error) {
          console.error("Error fetching cadre:", error);
          toast.error("Could not load cadre");
        }
      };
      fetchCadre();
    }
  }, [id, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCadreData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}cadres`, cadreData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        id ? "Cadre updated successfully!" : "Cadre created successfully!"
      );
      setTimeout(() => {
      navigate("/dashboard/cadre");
      }, 1000);
    } catch (error) {
      console.error("Error saving cadre:", error);
      toast.error(error.response?.data?.message || "Error saving cadre.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Cadre" : "Add Cadre"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Cadre Name */}
              <div className="formInput">
                <label>Cadre Name:</label>
                <select
                  name="cadreName"
                  value={cadreData.cadreName || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Cadre Name --</option>
                  <option value="Farm Attendant">Farm Attendant</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Veterinary Officer">Veterinary Officer</option>
                  <option value="Processing Operator">
                    Processing Operator
                  </option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              {/* Payment Type */}
              <div className="formInput">
                <label>Payment Type:</label>
                <select
                  name="paymentType"
                  value={cadreData.paymentType}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Payment Type --</option>
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>

              {/* Rate */}
              <div className="formInput">
                <label>Rate (₦):</label>
                <input
                  type="number"
                  step="0.01"
                  name="rate"
                  value={cadreData.rate || ""}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  required
                />
              </div>

              {/* Description */}
              <div className="formInput">
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={cadreData.description || ""}
                  onChange={handleChange}
                  placeholder="e.g. Oversees farm workers"
                />
              </div>

              {/* Farm */}
              <div className="formInput">
                <label>Farm:</label>
                <select
                  name="farmId"
                  value={cadreData.farmId}
                  onChange={handleChange}
                  required
                >
                  {farms.map((farm) => (
                    <option key={farm.id || farm.name} value={farm.id}>
                      {farm.farmName}
                    </option>
                  ))}
                </select>
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

export default AddNewCadre;
