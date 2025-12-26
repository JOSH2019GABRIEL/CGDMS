import "../../../style/new.scss";
import "../../../style/addorder.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddScheme = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loadingScheme, setLoadingScheme] = useState(true);

  const [scheme, setScheme] = useState({
    id: "",
    schemeName: "",
    description: "",
    isActive: true,
    rules: [],
  });

  // LOAD PRODUCTS ------------------------------------------------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}product`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data.content || res.data);
      } catch (err) {
        toast.error("Unable to load products");
      }
    };
    loadProducts();
  }, [token]);

  // LOAD EXISTING SCHEME ------------------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchScheme = async () => {
      try {
        const res = await axios.get(`${baseUrl}commission-scheme/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        // Normalize
        setScheme({
          id: data.id,
          schemeName: data.schemeName || "",
          description: data.description || "",
          isActive: data.isActive ?? true,
          rules: Array.isArray(data.rules)
            ? data.rules.map((r) => ({
                productId: r.productId || "",
                minQty: r.minQty ?? 0,
                maxQty: r.maxQty ?? 0,
                commissionType: r.commissionType || "PER_UNIT",
                commissionValue: r.commissionValue ?? 0,
              }))
            : [],
        });

        setLoadingScheme(false);
      } catch (err) {
        toast.error("Could not load scheme");
      }
    };

    fetchScheme();
  }, [id, token]);

  if (id && loadingScheme) {
    return <p style={{ padding: 20 }}>Loading scheme...</p>;
  }

  // ADD RULE ------------------------------------------------------
  const addRule = () => {
    setScheme((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        {
          productId: "",
          minQty: "",
          maxQty: "",
          commissionType: "",
          commissionValue: "",
        },
      ],
    }));
  };

  // REMOVE RULE ---------------------------------------------------
  const removeRule = (index) => {
    setScheme((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  // HANDLE RULE CHANGE --------------------------------------------
  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...scheme.rules];
    updatedRules[index][field] =
      field === "minQty" ||
      field === "maxQty" ||
      field === "commissionValue"
        ? Number(value)
        : value;

    setScheme({ ...scheme, rules: updatedRules });
  };

  // SUBMIT ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}commission-scheme/${id}`, scheme, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Scheme updated successfully!");
      } else {
        await axios.post(`${baseUrl}commission-scheme`, scheme, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Scheme created successfully!");
      }

      setTimeout(() => navigate("/dashboard/schemes"), 1000);
    } catch (err) {
      toast.error("Failed to save scheme");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{id ? "Update Commission Scheme" : "Create New Commission Scheme"}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bottom">
            <div className="right">

              {/* SCHEME NAME */}
              <div className="formInput">
                <label>Scheme Name</label>
                <input
                  type="text"
                  value={scheme.schemeName}
                  onChange={(e) =>
                    setScheme({ ...scheme, schemeName: e.target.value })
                  }
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="formInput">
                <label>Description</label>
                <textarea
                  value={scheme.description}
                  onChange={(e) =>
                    setScheme({ ...scheme, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              {/* STATUS */}
              <div className="formInput">
                <label>Status</label>
                <select
                  value={scheme.isActive}
                  onChange={(e) =>
                    setScheme({
                      ...scheme,
                      isActive: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* RULES SECTION */}
              <div className="cartContainer">
                <h3>Commission Rules</h3>

                {(scheme.rules || []).map((rule, index) => (
                  <div className="itemRow" key={index}>
                    {/* PRODUCT */}
                    <select
                      value={rule.productId}
                      onChange={(e) =>
                        handleRuleChange(index, "productId", e.target.value)
                      }
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.productName}
                        </option>
                      ))}
                    </select>

                    {/* MIN */}
                    <input
                      type="number"
                      min="0"
                      value={rule.minQty}
                      onChange={(e) =>
                        handleRuleChange(index, "minQty", e.target.value)
                      }
                    />

                    {/* MAX */}
                    <input
                      type="number"
                      min="0"
                      value={rule.maxQty}
                      onChange={(e) =>
                        handleRuleChange(index, "maxQty", e.target.value)
                      }
                    />

                    {/* TYPE */}
                    <select
                      value={rule.commissionType}
                      onChange={(e) =>
                        handleRuleChange(index, "commissionType", e.target.value)
                      }
                    >
                      <option value="PER_UNIT">Per Unit</option>
                      <option value="PERCENTAGE">Percentage</option>
                    </select>

                    {/* VALUE */}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rule.commissionValue}
                      onChange={(e) =>
                        handleRuleChange(
                          index,
                          "commissionValue",
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="removeBtn"
                      onClick={() => removeRule(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button type="button" className="addItemBtn" onClick={addRule}>
                  + Add Rule
                </button>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="submitWrapper">
            <button type="submit" className="submitBtn">
              {id ? "Update Scheme" : "Create Scheme"}
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AddScheme;
