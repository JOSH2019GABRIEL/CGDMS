import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddPlot = () => {
  const { id } = useParams();
  const [plotData, setPlotData] = useState({
    id: "",
    type: "",
    areaM2: "",
    soilType: "",
    bedLayout: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch existing plot if editing
  useEffect(() => {
    if (id) {
      const fetchPlot = async () => {
        try {
          const response = await axios.get(`${baseUrl}plot/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPlotData(response.data);
        } catch (error) {
          console.error("Error fetching plot details:", error);
          toast.error("Could not load plot details.");
        }
      };
      fetchPlot();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlotData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}plot`, plotData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Plot record created successfully!");
      setTimeout(() => {
        navigate("/dashboard/plots");
      }, 1000);
    } catch (error) {
      console.error("Error saving plot:", error);
      setTimeout(() => {
        toast.error(error.response?.data?.message || "Error saving plot.");
      }, 1000);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Plot" : "Add New Plot"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Plot Type */}
              <div className="formInput">
                <label>Plot Type:</label>
                <select
                  name="type"
                  value={plotData.type || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Plot Type --</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Grain">Grain</option>
                  <option value="Poultry">Poultry</option>
                  <option value="Fish Pond">Fish Pond</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Area (m²) */}
              <div className="formInput">
                <label>Area (m²):</label>
                <input
                  type="number"
                  step="0.01"
                  name="areaM2"
                  value={plotData.areaM2 || ""}
                  onChange={handleChange}
                  placeholder="e.g. 250.5"
                  required
                />
              </div>

              {/* Soil Type */}
              <div className="formInput">
                <label>Soil Type:</label>
                <select
                  name="soilType"
                  value={plotData.soilType || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Soil Type --</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silty">Silty</option>
                  <option value="Peaty">Peaty</option>
                  <option value="Chalky">Chalky</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Bed Layout */}
              <div className="formInput">
                <label>Bed Layout:</label>
                <select
                  name="bedLayout"
                  value={plotData.bedLayout || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Bed Layout --</option>
                  <option value="Raised">Raised Beds</option>
                  <option value="Flat">Flat Beds</option>
                  <option value="Ridged">Ridged Rows</option>
                  <option value="Container">Container</option>
                  <option value="Hydroponic">Hydroponic</option>
                  <option value="Other">Other</option>
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

export default AddPlot;
