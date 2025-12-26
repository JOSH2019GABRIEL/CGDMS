import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url as baseUrl } from "../../../api";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddNominalLoss = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [valueError, setValueError] = useState("");

  const [nominalLoss, setNominalLoss] = useState({
    id: "",
    rate: "",
    description: "",
    value: "",
    category: "",
  });

  useEffect(() => {
    if (id) {
      const fetchRecord = async () => {
        try {
          const response = await axios.get(`${baseUrl}nominal-loss/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setNominalLoss(response.data);
        } catch (error) {
          console.error("Error fetching nominal loss record:", error);
          toast.error("Could not load nominal loss record.");
        }
      };
      fetchRecord();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate VALUE field
    if (name === "value") {
      let numericValue = parseFloat(value);

      if (isNaN(numericValue)) {
        setValueError("Value is required.");
        setNominalLoss((prev) => ({ ...prev, value: "" }));
        return;
      }

      // Validation when rate = PERCENT
      if (nominalLoss.rate === "PERCENTAGE") {
        if (numericValue > 100) {
          setValueError("Percentage cannot exceed 100%");
          numericValue = 100;
        } else {
          setValueError(""); // Clear error
        }
      } else {
        // For other rate types → clear error
        setValueError("");
      }

      setNominalLoss((prev) => ({ ...prev, value: numericValue }));
      return;
    }

    // Normal updates
    setNominalLoss((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Revalidate when rate changes
    if (name === "rate") {
      if (value === "PERCENTAGE" && nominalLoss.value > 100) {
        setValueError("Percentage cannot exceed 100%");
      } else {
        setValueError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}nominal-loss`, nominalLoss, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        id
          ? "Nominal loss updated successfully!"
          : "Nominal loss added successfully!"
      );

      setTimeout(() => {
        navigate("/dashboard/nominal-loss");
      }, 1000);
    } catch (error) {
      console.error("Error saving nominal loss:", error);
      toast.error(
        error.response?.data?.message || "Error saving nominal loss."
      );
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{id ? "Edit Nominal Loss" : "Add Nominal Loss"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* RATE */}
              <div className="formInput">
                <label>Rate Type:</label>
                <select
                  name="rate"
                  value={nominalLoss.rate}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- Select Rate Type --
                  </option>
                  <option value="PER_UNIT">Per Unit</option>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="formInput">
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={nominalLoss.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  required
                />
              </div>

              {/* VALUE */}
              <div className="formInput">
                <label>Value:</label>
                <input
                  type="number"
                  name="value"
                  value={nominalLoss.value}
                  onChange={handleChange}
                  min="0"
                  max={nominalLoss.rate === "PERCENTAGE" ? 100 : undefined}
                  className={valueError ? "inputError" : ""}
                  required
                />

                {valueError && <div className="errorText">{valueError}</div>}
              </div>

              <div className="formInput">
                <label>Nominal Category:</label>
                <select
                  name="category"
                  value={nominalLoss.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- Select Category --
                  </option>
                  <option value="Fishery">Fish</option>
                  <option value="Broiler">Broiler</option>
                  <option value="Vegetation">Vegetables</option>
                </select>
              </div>

              {/* <div className="formInput">
                <input hidden />
              </div> */}

              <button type="submit" disabled={valueError !== ""}>
                {id ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddNominalLoss;
