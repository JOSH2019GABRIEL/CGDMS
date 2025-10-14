import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddSalesLink = () => {
  const { id } = useParams();
  const [harvestBatches, setHarvestBatches] = useState([]);
  const [sales, setSales] = useState({
    id: "",
    salesInvoice: "",
    marketDestination: "",
    harvestBatchId: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch Harvest Batches
  useEffect(() => {
    const fetchHarvestBatches = async () => {
      try {
        const response = await axios.get(`${baseUrl}harvest-batches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHarvestBatches(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching harvest batches:", error);
        toast.error("Could not load harvest batches.");
      }
    };
    fetchHarvestBatches();
  }, [token]);

  // ✅ Fetch Sales record if editing
  useEffect(() => {
    if (id) {
      const fetchSales = async () => {
        try {
          const response = await axios.get(`${baseUrl}sales-links/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSales(response.data);
        } catch (error) {
          console.error("Error fetching sales record:", error);
          toast.error("Could not load sales details.");
        }
      };
      fetchSales();
    }
  }, [id, token]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSales((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}sales-links`, sales, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(
        id
          ? "Sales record updated successfully!"
          : "Sales record created successfully!"
      );
      setTimeout(() => {
        navigate("/dashboard/sales");
      }, 1000);
    } catch (error) {
      console.error("Error saving sales record:", error);
      setTimeout(() => {
        toast.error(error.response?.data?.message || "Error saving record.");
      }, 1000);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Sales Record" : "Add Sales Record"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Sales Invoice */}
              <div className="formInput">
                <label>Sales Invoice:</label>
                <input
                  type="text"
                  name="salesInvoice"
                  value={sales.salesInvoice || ""}
                  onChange={handleChange}
                  placeholder="Enter sales invoice"
                  required
                />
              </div>

              {/* Market Destination */}
              <div className="formInput">
                <label>Market Destination:</label>
                <input
                  type="text"
                  name="marketDestination"
                  value={sales.marketDestination || ""}
                  onChange={handleChange}
                  placeholder="Enter Destination"
                  required
                />
              </div>

              {/* Harvest Batch */}
              <div className="formInput">
                <label>Harvest Batch:</label>
                <select
                  name="harvestBatchId"
                  value={sales.harvestBatchId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Harvest Batch --</option>
                  {harvestBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.date
                        ? `${batch.date} - Batch ${batch.id}`
                        : `Batch ${batch.id}`}
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

export default AddSalesLink;
