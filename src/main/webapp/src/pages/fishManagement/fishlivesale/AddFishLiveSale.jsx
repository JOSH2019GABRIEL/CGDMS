import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddFishLiveSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [postHarvestList, setPostHarvestList] = useState([]);
  const [liveSale, setLiveSale] = useState({
    id: "",
    postHarvestId: "",
    buyName: "",
    salePricePerKg: "",
    totalSaleValue: "",
    paymentStatus: "",
    invoiceNo: "",
    dispatchMethod: "",
    quantitySale: "",
  });

  // ✅ Fetch post-harvests for dropdown
  useEffect(() => {
    const fetchPostHarvests = async () => {
      try {
        const response = await axios.get(`${baseUrl}fish-post-harvest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPostHarvestList(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching post-harvest list:", error);
        toast.error("Could not load post-harvest list.");
      }
    };
    fetchPostHarvests();
  }, [token]);

  useEffect(() => {
    if (id) {
      const fetchLiveSale = async () => {
        try {
          const response = await axios.get(`${baseUrl}fish-live-sales/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLiveSale(response.data);
        } catch (error) {
          console.error("Error fetching live sale details:", error);
          toast.error("Could not load live sale record.");
        }
      };
      fetchLiveSale();
    }
  }, [id, token]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setLiveSale((prevState) => {
      const updated = {
        ...prevState,
        [name]: value,
      };
      // Auto compute totalSaleValue
      if (name === "salePricePerKg" || name === "quantitySale") {
        const price = parseFloat(
          name === "salePricePerKg" ? value : prevState.salePricePerKg
        );
        const qty = parseFloat(
          name === "quantitySale" ? value : prevState.quantitySale
        );

        if (!isNaN(price) && !isNaN(qty)) {
          updated.totalSaleValue = (price * qty).toFixed(2);
        } else {
          updated.totalSaleValue = "";
        }
      }

      return updated;
    });
  };

  // ✅ Handle submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}fish-live-sales`, liveSale, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        id
          ? "Fish live sale record updated successfully!"
          : "Fish live sale record added successfully!"
      );

      setTimeout(() => {
        navigate("/dashboard/fish-sales");
      }, 1000);
    } catch (error) {
      console.error("Error saving live sale:", error);
      toast.error(error.response?.data?.message || "Error saving live sale.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{id ? "Edit Fish Live Sale" : "Add Fish Live Sale"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Post Harvest Selection */}
              <div className="formInput">
                <label>Post-Harvest Record:</label>
                <select
                  name="postHarvestId"
                  value={liveSale.postHarvestId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Post-Harvest --</option>
                  {postHarvestList.map((ph) => (
                    <option key={ph.id} value={ph.id}>
                      {ph.destinationType} (Batch: {ph.destinationBatchNo})
                    </option>
                  ))}
                </select>
              </div>

              {/* Buyer Name */}
              <div className="formInput">
                <label>Buyer Name:</label>
                <input
                  type="text"
                  name="buyName"
                  value={liveSale.buyName || ""}
                  onChange={handleChange}
                  placeholder="Enter buyer name"
                  required
                />
              </div>

              <div className="formInput">
                <label>Sale Price per Kg (₦):</label>
                <input
                  type="number"
                  name="salePricePerKg"
                  value={liveSale.salePricePerKg || ""}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Enter price per kg"
                  required
                />
              </div>

              {/* Quantity Sale */}
              <div className="formInput">
                <label>Quantity Sale (Kg):</label>
                <input
                  type="number"
                  name="quantitySale"
                  value={liveSale.quantitySale || ""}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Enter quantity sold"
                  required
                />
              </div>

              {/* Total Sale Value */}
              <div className="formInput">
                <label>Total Sale Value (₦):</label>
                <input
                  type="number"
                  name="totalSaleValue"
                  value={liveSale.totalSaleValue || ""}
                  readOnly
                  step="0.01"
                  placeholder="Auto-calculated"
                />
              </div>

              {/* Payment Status */}
              <div className="formInput">
                <label>Payment Status:</label>
                <select
                  name="paymentStatus"
                  value={liveSale.paymentStatus || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Status --</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                </select>
              </div>

              {/* Invoice Number */}
              <div className="formInput">
                <label>Invoice Number:</label>
                <input
                  type="text"
                  name="invoiceNo"
                  value={liveSale.invoiceNo || ""}
                  onChange={handleChange}
                  placeholder="Enter invoice number"
                  required
                />
              </div>

              <div className="formInput">
                <label>Dispatch Method:</label>
                <select
                  name="dispatchMethod"
                  value={liveSale.dispatchMethod || ""}
                  onChange={handleChange}
                  required
                  className="formSelect"
                >
                  <option value="" disabled>
                    Select dispatch method
                  </option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Motorbike">Motorbike</option>
                  <option value="Boat">Boat</option>
                  <option value="Courier Service">Courier Service</option>
                  <option value="Customer Pickup">Customer Pickup</option>
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

export default AddFishLiveSale;
