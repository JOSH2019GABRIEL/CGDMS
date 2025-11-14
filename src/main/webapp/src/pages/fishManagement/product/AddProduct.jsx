import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState({
    id: "",
    sku: "",
    productName: "",
    unitSizeG: "",
    unitPrice: "",
    categoryName: "",
    isActive: true,
  });

  // Load product for editing
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`${baseUrl}product/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProduct(response.data);
        } catch (error) {
          console.error("Error fetching product:", error);
          toast.error("Could not load product details.");
        }
      };
      fetchProduct();
    }
  }, [id, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}product`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        id ? "Product updated successfully!" : "Product added successfully!"
      );

      setTimeout(() => {
        navigate("/dashboard/products");
      }, 1000);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Error saving product.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{id ? "Edit Product" : "Add New Product"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* SKU */}
              <div className="formInput">
                <label>SKU:</label>
                <input
                  type="text"
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  placeholder="Enter product SKU"
                  required
                />
              </div>

              {/* Product Name */}
              <div className="formInput">
                <label>Product Name:</label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Unit Size (grams) */}
              <div className="formInput">
                <label>Unit Size (g):</label>
                <input
                  type="number"
                  name="unitSizeG"
                  value={product.unitSizeG}
                  onChange={handleChange}
                  placeholder="Enter unit size in grams"
                  required
                />
              </div>

              {/* Unit Price */}
              <div className="formInput">
                <label>Unit Price (₦):</label>
                <input
                  type="number"
                  step="0.01"
                  name="unitPrice"
                  value={product.unitPrice}
                  onChange={handleChange}
                  placeholder="Enter unit price"
                  required
                />
              </div>

              <div className="formInput">
                <label>Product Category:</label>
                <select
                  name="categoryName"
                  value={product.categoryName || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Category --</option>
                  <option value="Live Fish">Live Fish</option>
                  <option value="Smoked Fish">Smoked Fish</option>
                  <option value="Feed">Feed</option>
                  <option value="Fingerlings">Fingerlings</option>
                  <option value="Materials">Materials</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>

              {/* Active Status */}
              <div className="formInput">
                <label>Active:</label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={product.isActive}
                  onChange={handleChange}
                />
              </div>

              <button type="submit">
                {id ? "Update Product" : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddProduct;
