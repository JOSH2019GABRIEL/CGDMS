import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";

const FulfilmentOrder = () => {
  const token = localStorage.getItem("token");

  const [records, setRecords] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [centerFilter, setCenterFilter] = useState("");

  const [counts, setCounts] = useState({
    ALL: 0,
    PENDING_FULFILLMENT: 0,
    PROCESSING: 0,
    DISPATCHED: 0,
    FULFILLED: 0,
    CANCELLED: 0,
  });

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [modalRecordId, setModalRecordId] = useState(null);

  const [postHarvestList, setPostHarvestList] = useState([]);
  const [selectedPostHarvestId, setSelectedPostHarvestId] = useState("");
  const [processedQuantity, setProcessedQuantity] = useState("");
  const [processingType, setProcessingType] = useState("");

  // NEW: inline errors state
  const [errors, setErrors] = useState({
    postHarvest: "",
    processingType: "",
    processedQuantity: "",
  });

  const buildUrl = (status, pageArg, sizeArg, search, center) => {
    const p = pageArg ?? page;
    const s = sizeArg ?? pageSize;

    const q = search ? `&search=${encodeURIComponent(search)}` : "";
    const c = center ? `&center=${encodeURIComponent(center)}` : "";

    if (status === "ALL") {
      return `${baseUrl}fulfillment?page=${p}&size=${s}${q}${c}`;
    }

    return `${baseUrl}fulfillment/fulfil-status?page=${p}&size=${s}&status=${status}${q}${c}`;
  };

  const fetchCounts = useCallback(async () => {
    try {
      const newCounts = { ...counts };

      const allRes = await axios.get(
        `${baseUrl}fulfillment?page=0&size=1`,
        authHeaders
      );
      newCounts.ALL = allRes.data?.totalElements ?? 0;

      const keys = Object.keys(newCounts).filter((k) => k !== "ALL");

      const results = await Promise.all(
        keys.map((k) =>
          axios
            .get(
              `${baseUrl}fulfillment/fulfil-status?page=0&size=1&status=${k}`,
              authHeaders
            )
            .then((r) => ({ k, total: r.data?.totalElements ?? 0 }))
            .catch(() => ({ k, total: 0 }))
        )
      );

      results.forEach((r) => (newCounts[r.k] = r.total));

      setCounts(newCounts);
    } catch (err) {
      console.error("Error fetching counts", err);
    }
  }, [token]);

  const fetchRecords = useCallback(
    async (
      pageArg = page,
      sizeArg = pageSize,
      statusArg = activeTab,
      search = searchTerm,
      center = centerFilter
    ) => {
      setLoading(true);
      try {
        const url = buildUrl(statusArg, pageArg, sizeArg, search, center);

        const response = await axios.get(url, authHeaders);
        const { content = [], totalElements = 0 } = response.data || {};

        const rows = content.map((rec, idx) => ({
          id: rec.id ?? idx,
          ...rec,
        }));

        setRecords(rows);
        setRowCount(totalElements);
      } catch (err) {
        toast.error("Failed to load records");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, activeTab, searchTerm, centerFilter, token]
  );

  useEffect(() => {
    fetchRecords(0, pageSize, activeTab, searchTerm, centerFilter);
    fetchCounts();
  }, [activeTab, searchTerm, centerFilter, pageSize]);

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

  const openOrderModal = async (fulfillmentId, action, orderId) => {
    setModalOrder(null);
    setModalLoading(true);
    setModalOpen(true);

    setModalAction(action);
    setModalRecordId(fulfillmentId);

    // Reset modal fields
    setSelectedPostHarvestId("");
    setProcessedQuantity("");
    setProcessingType("");
    setErrors({ postHarvest: "", processingType: "", processedQuantity: "" });

    try {
      const res = await axios.get(
        `${baseUrl}order-place/${orderId}`,
        authHeaders
      );
      setModalOrder(res.data);
    } catch (error) {
      toast.error("Failed to load order details.");
    } finally {
      setModalLoading(false);
    }
  };

  const executeAction = async () => {
    try {
      let url = "";

      switch (modalAction) {
        case "processed": {
          const params = new URLSearchParams({
            processingType,
            processedQty: processedQuantity,
            postHarvestId: selectedPostHarvestId,
          });

          url = `${baseUrl}fulfillment/${modalRecordId}/processed?${params.toString()}`;
          break;
        }

        // 🔹 DISPATCH
        case "dispatched":
        case "dispatch":
          url = `${baseUrl}fulfillment/${modalRecordId}/dispatched`;
          break;

        // 🔹 FULFILL
        case "fulfilled":
        case "fulfill":
          url = `${baseUrl}fulfillment/${modalRecordId}/fulfilled`;
          break;

        // 🔹 CANCEL
        case "cancelled":
        case "cancel":
          url = `${baseUrl}fulfillment/${modalRecordId}/cancelled`;
          break;

        // 🔹 FAILED (maps to cancelled unless backend has separate endpoint)
        case "failed":
          url = `${baseUrl}fulfillment/${modalRecordId}/cancelled`;
          break;

        // 🔹 PROCESSING (manual)
        case "processing":
          url = `${baseUrl}fulfillment/${modalRecordId}/processing`;
          break;

        default:
          throw new Error(`Unknown action: ${modalAction}`);
      }

      console.log("Calling URL:", url);

      await axios.put(url, {}, authHeaders);

      toast.success("Order updated successfully");
      setModalOpen(false);
      fetchRecords();
      fetchCounts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  };

  // const executeAction = async () => {
  //   try {
  //     await axios.put(
  //       `${baseUrl}fulfillment/${modalRecordId}/${modalAction}`,
  //       {},
  //       authHeaders
  //     );
  //     toast.success("Order updated successfully");
  //     setModalOpen(false);
  //     fetchRecords();
  //     fetchCounts();
  //   } catch (err) {
  //     toast.error("Failed to update order");
  //   }
  // };

  // ---------- Validation helpers ----------
  const validateProcessing = () => {
    // full validation, sets errors and shows toast for first failing rule
    const temp = { postHarvest: "", processingType: "", processedQuantity: "" };
    let ok = true;

    if (!selectedPostHarvestId) {
      temp.postHarvest = "Post-harvest batch is required.";
      ok = false;
    }

    if (!processingType) {
      temp.processingType = "Processing type is required.";
      ok = false;
    }

    const qty = Number(processedQuantity);

    if (!qty || qty <= 0) {
      temp.processedQuantity = "Enter a quantity greater than 0.";
      ok = false;
    }

    const ph = postHarvestList.find(
      (p) => p.id.toString() === selectedPostHarvestId.toString()
    );

    if (!ph && selectedPostHarvestId) {
      temp.postHarvest = "Selected post-harvest batch is invalid.";
      ok = false;
    }

    if (ph && processingType === "quantityToSmokingKg" && ok) {
      if (qty > Number(ph.quantityToSmokingKg)) {
        temp.processedQuantity = `Cannot exceed Smoking Qty: ${ph.quantityToSmokingKg}`;
        ok = false;
      }
    }

    if (ph && processingType === "quantityToLiveSaleKg" && ok) {
      if (qty > Number(ph.quantityToLiveSaleKg)) {
        temp.processedQuantity = `Cannot exceed LiveSale Qty: ${ph.quantityToLiveSaleKg}`;
        ok = false;
      }
    }

    setErrors(temp);

    // show toast for first error so user also gets toast feedback immediately
    if (!ok) {
      const firstError =
        temp.postHarvest || temp.processingType || temp.processedQuantity;
      if (firstError) toast.error(firstError);
    }

    return ok;
  };

  const checkValidSilent = () => {
    // same checks as validateProcessing but without setting errors or toast
    if (modalAction !== "processed") return true; // no validation needed for other actions

    if (!selectedPostHarvestId) return false;
    if (!processingType) return false;

    const qty = Number(processedQuantity);
    if (!qty || qty <= 0) return false;

    const ph = postHarvestList.find(
      (p) => p.id.toString() === selectedPostHarvestId.toString()
    );
    if (!ph) return false;

    if (
      processingType === "quantityToSmokingKg" &&
      qty > Number(ph.quantityToSmokingKg)
    )
      return false;
    if (
      processingType === "quantityToLiveSaleKg" &&
      qty > Number(ph.quantityToLiveSaleKg)
    )
      return false;

    return true;
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "orderNumber", headerName: "Order Number", width: 150 },
    { field: "centerName", headerName: "Center", width: 160 },
    { field: "email", headerName: "Customer Email", width: 200 },
    {
      field: "createdTime",
      headerName: "Created",
      width: 180,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "---",
    },
    {
      field: "processingTime",
      headerName: "Processing",
      width: 180,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "---",
    },
    {
      field: "dispatchTime",
      headerName: "Dispatched",
      width: 180,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "---",
    },
    {
      field: "fulfillmentTime",
      headerName: "Fulfilled",
      width: 180,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "---",
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const map = {
          PENDING_FULFILLMENT: "Pending",
          PROCESSING: "Processing",
          DISPATCHED: "Dispatched",
          FULFILLED: "Completed",
          CANCELLED: "Cancelled",
        };

        return (
          <span className={`statusCell ${params.value?.toLowerCase()}`}>
            {map[params.value] || params.value}
          </span>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 260,
      renderCell: (params) => {
        const row = params.row;

        const options = [];

        if (row.status === "PENDING_FULFILLMENT")
          options.push({ value: "processed", label: "Mark Processed" });

        if (row.status === "PROCESSING")
          options.push({ value: "dispatched", label: "Mark Dispatched" });

        if (row.status === "DISPATCHED")
          options.push({ value: "fulfilled", label: "Mark Fulfilled" });

        if (row.status !== "FULFILLED" && row.status !== "CANCELLED") {
          options.push({ value: "failed", label: "Mark Failed" });
          options.push({ value: "cancelled", label: "Cancel Order" });
        }

        return (
          <select
            defaultValue=""
            onChange={(e) => {
              const action = e.target.value;
              if (!action) return;

              openOrderModal(row.id, action, row.orderId);

              e.target.value = "";
            }}
            style={{ padding: "6px 8px", minWidth: 180 }}
          >
            <option value="" disabled>
              Select Action
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  // -----------------------------------------
  //                 RENDER UI
  // -----------------------------------------
  return (
    <div className="datatable">
      <div className="datatableTitle">Fulfillment Orders</div>

      {/* SEARCH BAR */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by order, email, center..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          style={{ padding: 8, minWidth: 260 }}
        />

        <button
          onClick={() => {
            setSearchTerm("");
            setCenterFilter("");
            setPage(0);
            fetchRecords(0, pageSize, activeTab, "", "");
          }}
          className="btn"
        >
          Reset
        </button>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        {[
          { key: "PENDING_FULFILLMENT", label: "Pending" },
          { key: "PROCESSING", label: "Processing" },
          { key: "DISPATCHED", label: "Dispatched" },
          { key: "FULFILLED", label: "Completed" },
          { key: "CANCELLED", label: "Cancelled" },
          { key: "ALL", label: "All" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveTab(t.key);
              setPage(0);
            }}
            className={`tabButton ${activeTab === t.key ? "activeTab" : ""}`}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: activeTab === t.key ? "#2b7cff" : "#f3f3f3",
              color: activeTab === t.key ? "#fff" : "#333",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {/* DATAGRID */}
      <DataGrid
        className="datagrid"
        rows={records}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        page={page}
        pageSize={pageSize}
        loading={loading}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchRecords(newPage, pageSize, activeTab, searchTerm, centerFilter);
        }}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
          fetchRecords(0, newSize, activeTab, searchTerm, centerFilter);
        }}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
      />

      {/* ORDER INFO MODAL */}
      <Dialog
        open={modalOpen}
        onClose={() => !modalLoading && setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "4px 6px",
            animation: "fadeIn .25s ease-in-out",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            paddingBottom: 1,
          }}
        >
          {modalAction === "processed" && "Process Order"}
          {modalAction === "dispatched" && "Dispatch Order"}
          {modalAction === "fulfilled" && "Fulfill Order"}
        </DialogTitle>

        <DialogContent dividers sx={{ paddingX: 2, paddingY: 3 }}>
          {modalLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <CircularProgress />
            </div>
          ) : modalOrder ? (
            <>
              {/* ORDER INFO */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  Order #{modalOrder.orderNumber}
                </div>
                <div>{modalOrder.customerName}</div>
                <div>{modalOrder.email}</div>
                <div style={{ color: "#555" }}>
                  {modalOrder.deliveryAddress}
                </div>
              </div>

              {/* ITEMS */}
              <div
                style={{
                  background: "#f9f9f9",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              >
                <strong>Items</strong>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  {modalOrder.items.map((item) => (
                    <li key={item.orderItemId}>
                      {item.product.productName} — {item.quantity} @ ₦
                      {item.unitPrice} ----- Category: {modalOrder.category}
                    </li>
                  ))}
                </ul>

                <h3 style={{ marginTop: 10 }}>
                  Total: ₦{modalOrder.totalAmount.toFixed(2)}
                </h3>
              </div>

              {/* PROCESS SECTION */}
              {modalAction === "processed" && (
                <>
                  <h3 style={{ marginBottom: 10 }}>Processing Information</h3>

                  {/* POST HARVEST */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600 }}>
                      Post-Harvest Batch
                    </label>
                    <select
                      value={selectedPostHarvestId}
                      onChange={(e) => {
                        setSelectedPostHarvestId(e.target.value);
                        setErrors((prev) => ({ ...prev, postHarvest: "" }));
                      }}
                      style={{
                        width: "100%",
                        padding: 12,
                        marginTop: 6,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">-- Select Batch --</option>
                      {postHarvestList.map((ph) => (
                        <option key={ph.id} value={ph.postHarvestBatchId}>
                          {ph.postHarvestBatchId} — Smoking:{" "}
                          {ph.quantityToSmokingKg} — LiveSale:{" "}
                          {ph.quantityToLiveSaleKg}
                        </option>
                      ))}
                    </select>

                    {errors.postHarvest && (
                      <p style={{ color: "red", marginTop: 4 }}>
                        {errors.postHarvest}
                      </p>
                    )}
                  </div>

                  {/* PROCESSING TYPE */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600 }}>Processing Type</label>
                    <select
                      value={processingType}
                      onChange={(e) => {
                        setProcessingType(e.target.value);
                        setErrors((prev) => ({ ...prev, processingType: "" }));
                      }}
                      style={{
                        width: "100%",
                        padding: 12,
                        marginTop: 6,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">-- Select Type --</option>
                      <option value="quantityToSmokingKg">Smoked</option>
                      <option value="quantityToLiveSaleKg">Lived</option>
                    </select>

                    {errors.processingType && (
                      <p style={{ color: "red", marginTop: 4 }}>
                        {errors.processingType}
                      </p>
                    )}
                  </div>

                  {/* QUANTITY */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600 }}>Number Processed</label>
                    <input
                      type="number"
                      value={processedQuantity}
                      onChange={(e) => {
                        setProcessedQuantity(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          processedQuantity: "",
                        }));
                      }}
                      placeholder="Enter amount processed"
                      style={{
                        width: "100%",
                        padding: 12,
                        marginTop: 6,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    />

                    {errors.processedQuantity && (
                      <p style={{ color: "red", marginTop: 4 }}>
                        {errors.processedQuantity}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <p>No order details found.</p>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={() => setModalOpen(false)}>Close</Button>

          {!modalLoading && modalOrder && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2b7cff",
                paddingX: 3,
                "&:hover": { backgroundColor: "#1a5ed8" },
              }}
              onClick={() => {
                // 🔴 VALIDATE ONLY FOR PROCESSED
                if (modalAction === "processed") {
                  const newErrors = {};

                  if (!selectedPostHarvestId)
                    newErrors.postHarvest =
                      "Please select a post-harvest batch.";

                  if (!processingType)
                    newErrors.processingType =
                      "Please select a processing type.";

                  const qty = Number(processedQuantity);

                  if (!qty || qty <= 0)
                    newErrors.processedQuantity = "Enter a valid quantity.";

                  const ph = postHarvestList.find(
                    (p) => p.id.toString() === selectedPostHarvestId.toString()
                  );

                  if (
                    ph &&
                    processingType === "quantityToSmokingKg" &&
                    qty > ph.quantityToSmokingKg
                  )
                    newErrors.processedQuantity = `Processed quantity cannot exceed Smoking Qty (${ph.quantityToSmokingKg}).`;

                  if (
                    ph &&
                    processingType === "quantityToLiveSaleKg" &&
                    qty > ph.quantityToLiveSaleKg
                  )
                    newErrors.processedQuantity = `Processed quantity cannot exceed LiveSale Qty (${ph.quantityToLiveSaleKg}).`;

                  // SET ERRORS
                  setErrors(newErrors);

                  // TOAST ERRORS
                  Object.values(newErrors).forEach((err) => toast.error(err));

                  // ❌ STOP HERE IF ANY ERROR
                  if (Object.keys(newErrors).length > 0) return;
                }

                // ✅ ALL OTHER ACTIONS COME STRAIGHT HERE
                executeAction();

                setModalOpen(false);
              }}
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FulfilmentOrder;
