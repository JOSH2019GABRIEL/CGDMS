import "../../../style/new.scss";
import "../../../style/addorder.scss";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddOrder = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [farms, setFarms] = useState([]);

  const [order, setOrder] = useState({
    id: "",
    orderNumber: "",
    agentId: "",
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    items: [],
    totalAmount: 0,
    fulfillmentCenterId: "",
    email: "",
  });

  // Generate Order Number
  const generateOrderId = () => {
  const now = new Date();
  const date =
    String(now.getDate()).padStart(2, "0") +
    String(now.getMonth() + 1).padStart(2, "0");

  const random = Math.floor(Math.random() * 900 + 100);
  return `ODR-${date}-${random}`;
};


  // Auto-generate order number on NEW order
  useEffect(() => {
    if (!id) {
      setOrder((prev) => ({
        ...prev,
        orderNumber: generateOrderId(),
      }));
    }
  }, [id]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}product`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data.content || res.data);
      } catch (error) {
        toast.error("Unable to load products");
      }
    };
    loadProducts();
  }, [token]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(`${baseUrl}farms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarms(response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };
    fetchFarms();
  }, [token]);

  // Load Order for Editing
  useEffect(() => {
    if (!id) return; // If creating new, skip

    if (products.length === 0) return; // Wait until products are loaded

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${baseUrl}order-place/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        // Recalculate items based on products
        const updatedItems = data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId);

          const unitPrice = product ? product.unitPrice : item.unitPrice;
          const total = item.quantity * unitPrice;

          return {
            ...item,
            unitPrice,
            total,
          };
        });

        setOrder({
          ...data,
          items: updatedItems,
          totalAmount: updatedItems.reduce((s, i) => s + i.total, 0),
        });

        setLoadingOrder(false);
      } catch (error) {
        toast.error("Could not load order");
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id, token, products]);

  // Add a new item row
  const addItem = () => {
    setOrder((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: "", quantity: 1, unitPrice: 0, total: 0 },
      ],
    }));
  };

  // Remove item
  const removeItem = (index) => {
    const updatedItems = order.items.filter((_, i) => i !== index);
    updateTotals(updatedItems);
  };

  // Update item details
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] =
      field === "quantity" || field === "unitPrice" ? parseFloat(value) : value;

    if (field === "productId") {
      const selectedProduct = products.find((p) => p.id === parseInt(value));
      updatedItems[index].unitPrice = selectedProduct
        ? selectedProduct.unitPrice
        : 0;
    }

    updatedItems[index].total =
      updatedItems[index].quantity * updatedItems[index].unitPrice;

    updateTotals(updatedItems);
  };

  // Update total order amount
  const updateTotals = (items) => {
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    setOrder((prev) => ({ ...prev, items, totalAmount }));
  };

  // Handle submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update
        await axios.put(`${baseUrl}order-place/${id}`, order, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Order updated successfully!");
      } else {
        // Create
        await axios.post(`${baseUrl}order-place`, order, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Order created successfully!");
      }

      setTimeout(() => navigate("/dashboard/orders"), 1200);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save order");
    }
  };

  if (id && loadingOrder) {
    return <p style={{ padding: 20 }}>Loading order...</p>;
  }

//   const generateOrderId = () => {
//     const timestamp = Date.now();
//     const random = Math.floor(Math.random() * 1000)
//       .toString()
//       .padStart(3, "0");
//     return `ODR-${timestamp}-${random}`;
//   };

//   // Auto-generate order number on new order
//   useEffect(() => {
//     if (!id) {
//       setOrder((prev) => ({
//         ...prev,
//         orderNumber: generateOrderId(),
//       }));
//     }
//   }, [id]);

  return (
    <div className="new">
      <Sidebar />

      <div className="newContainer">
        <Navbar />

        <div className="top">
          <h1>{id ? "Update Order" : "Create New Order"}</h1>
        </div>

        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* Order Number */}
              <div className="formInput">
                <label>Order Number:</label>
                <input
                  type="text"
                  value={order.orderNumber}
                  onChange={(e) =>
                    setOrder({ ...order, orderNumber: e.target.value })
                  }
                  required
                />
              </div>

              {/* Customer Name */}
              <div className="formInput">
                <label>Customer Name:</label>
                <input
                  type="text"
                  value={order.customerName}
                  onChange={(e) =>
                    setOrder({ ...order, customerName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Customer Phone */}
              <div className="formInput">
                <label>Phone:</label>
                <input
                  type="text"
                  value={order.customerPhone}
                  onChange={(e) =>
                    setOrder({ ...order, customerPhone: e.target.value })
                  }
                  required
                />
              </div>

              {/* Delivery Address */}
              <div className="formInput">
                <label>Delivery Address:</label>
                <input
                  type="text"
                  value={order.deliveryAddress}
                  onChange={(e) =>
                    setOrder({ ...order, deliveryAddress: e.target.value })
                  }
                  required
                />
              </div>

              <div className="formInput">
                <label>Farm:</label>
                <select
                  name="fulfillmentCenterId"
                  value={order.fulfillmentCenterId}
                  onChange={(e) =>
                    setOrder({ ...order, fulfillmentCenterId: e.target.value })
                  }
                >
                  <option value="">-- Select Farm --</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.farmName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Customer Email:</label>
                <input
                  type="email"
                  value={order.email}
                  onChange={(e) =>
                    setOrder({ ...order, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* CART SECTION */}
              <div className="cartContainer">
                <h3>Order Items</h3>

                {order.items.map((item, index) => (
                  <div className="itemRow" key={index}>
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.productName}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                    />

                    <input type="number" value={item.unitPrice} readOnly />

                    <span className="itemTotal">₦{item.total.toFixed(2)}</span>

                    <button
                      type="button"
                      className="removeBtn"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button type="button" className="addItemBtn" onClick={addItem}>
                  + Add Item
                </button>
              </div>

              {/* TOTAL */}
              <div className="totalBar">
                Total Order Amount:{" "}
                <strong>₦{order.totalAmount.toFixed(2)}</strong>
              </div>
              {/* <div className="formInput">
                <label>Customer Name:</label>
                <input hidden />
                </div> */}

              <button type="submit">
                {id ? "Update Order" : "Create Order"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddOrder;
