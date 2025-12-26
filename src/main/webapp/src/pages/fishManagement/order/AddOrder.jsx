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
  const [farms, setFarms] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [order, setOrder] = useState({
    id: "",
    orderNumber: "",
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    items: [],
    totalAmount: 0,
    fulfillmentCenterId: "",
    email: "",
    category: "",
  });

  // Auto-generate order number
  const generateOrderId = () => {
    const now = new Date();
    const date =
      String(now.getDate()).padStart(2, "0") +
      String(now.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 900 + 100);
    return `ODR-${date}-${random}`;
  };

  useEffect(() => {
    if (!id) {
      setOrder((prev) => ({ ...prev, orderNumber: generateOrderId() }));
    }
  }, [id]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}product`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data.content || res.data);
      } catch {
        toast.error("Unable to load products");
      }
    };

    loadProducts();
  }, [token]);

  // Load farms
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

  // Load EXISTING ORDER for edit
  useEffect(() => {
    if (!id) return;
    if (products.length === 0) return; // wait until products arrive

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${baseUrl}order-place/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        // Convert backend items → UI items
        const formattedItems = data.items.map((item) => {
          const product = products.find((p) => p.id === item.product.id);

          return {
            orderItemId: item.orderItemId,
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: product ? product.unitPrice : item.unitPrice,
            total: item.quantity * (product ? product.unitPrice : item.unitPrice),
          };
        });

        setOrder({
          ...data,
          items: formattedItems,
          totalAmount: formattedItems.reduce((s, i) => s + i.total, 0),
        });

        setLoadingOrder(false);
      } catch (error) {
        toast.error("Could not load order");
        console.error("Error:", error);
      }
    };

    fetchOrder();
  }, [id, token, products]);

  // Add new line
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
    const updated = order.items.filter((_, i) => i !== index);
    updateTotals(updated);
  };

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const updated = [...order.items];

    updated[index][field] =
      field === "quantity" ? parseInt(value) : value;

    if (field === "productId") {
      const selectedProduct = products.find((p) => p.id === parseInt(value));
      updated[index].unitPrice = selectedProduct ? selectedProduct.unitPrice : 0;
    }

    updated[index].total =
      updated[index].quantity * updated[index].unitPrice;

    updateTotals(updated);
  };

  const updateTotals = (items) => {
    const totalAmount = items.reduce((sum, val) => sum + val.total, 0);

    setOrder((prev) => ({
      ...prev,
      items,
      totalAmount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...order,
      items: order.items.map((it) => ({
        orderItemId: it.orderItemId,
        productId: parseInt(it.productId),
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    };

    try {
      if (id) {
        await axios.put(`${baseUrl}order-place/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Order updated successfully!");
      } else {
        await axios.post(`${baseUrl}order-place`, payload, {
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
              {/* BASIC FIELDS */}
              <div className="formInput">
                <label>Order Number</label>
                <input
                  value={order.orderNumber}
                  onChange={(e) =>
                    setOrder({ ...order, orderNumber: e.target.value })
                  }
                />
              </div>

              <div className="formInput">
                <label>Customer Name</label>
                <input
                  value={order.customerName}
                  placeholder="Customer's name"
                  onChange={(e) =>
                    setOrder({ ...order, customerName: e.target.value })
                  }
                />
              </div>

              <div className="formInput">
                <label>Phone</label>
                <input
                  value={order.customerPhone}
                  maxLength={11}
                  placeholder="Telephone number"
                  onChange={(e) =>
                    setOrder({ ...order, customerPhone: e.target.value })
                  }
                />
              </div>

              <div className="formInput">
                <label>Fish Category:</label>
                <select
                  name="category"
                  value={order.category || ""}
                  onChange={(e) =>
                    setOrder({ ...order, category: e.target.value })}
                  required
                >
                  <option value="">-- Select Category --</option>
                  <option value="Live">Live</option>
                  <option value="Processed">Smoked</option>
                </select>
              </div>

              <div className="formInput">
                <label>Delivery Address</label>
                <textarea
                  value={order.deliveryAddress}
                  placeholder="Customer's Address"
                  onChange={(e) =>
                    setOrder({ ...order, deliveryAddress: e.target.value })
                  }
                />
              </div>

              <div className="formInput">
                <label>Farm</label>
                <select
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
                <label>Email</label>
                <input
                  type="email"
                  value={order.email}
                  onChange={(e) =>
                    setOrder({ ...order, email: e.target.value })
                  }
                />
              </div>

              
              <div className="formInput">
                <input hidden
                />
              </div>

              {/* CART */}
              <div className="cartContainer">
                <h3>Order Items</h3>

                {order.items.map((item, index) => (
                  <div className="itemRow" key={index}>
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
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

                    <span className="itemTotal">
                      ₦{item.total.toFixed(2)}
                    </span>

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

              <div className="totalBar">
                Total Order Amount:{" "}
                <strong>₦{order.totalAmount.toFixed(2)}</strong>
              </div>

              <button type="submit">{id ? "Update Order" : "Create Order"}</button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddOrder;
