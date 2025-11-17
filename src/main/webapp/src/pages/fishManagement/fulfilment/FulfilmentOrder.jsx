// FulfilmentOrder.js
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
  DialogContentText,
  DialogTitle,
  Button,
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
  const [centers, setCenters] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [counts, setCounts] = useState({
    ALL: 0,
    PENDING_FULFILLMENT: 0,
    PROCESSING: 0,
    DISPATCHED: 0,
    FULFILLED: 0,
  });

  const tabs = [
    { key: "PENDING_FULFILLMENT", label: "Pending" },
    { key: "PROCESSING", label: "Processing" },
    { key: "DISPATCHED", label: "Dispatched" },
    { key: "FULFILLED", label: "Fulfilled" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "ALL", label: "All" },
  ];

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ----------------------- LOAD CENTERS -----------------------
  useEffect(() => {
    const loadCenters = async () => {
      try {
        const res = await axios.get(`${baseUrl}centers`, authHeaders);
        setCenters(res.data || []);
      } catch {
        try {
          const res = await axios.get(`${baseUrl}farms`, authHeaders);
          setCenters(res.data || []);
        } catch {
          console.warn("No centers or farms endpoint available.");
        }
      }
    };
    loadCenters();
  }, []);

  // ----------------------- URL BUILDER -----------------------
  const buildUrl = (status, pageArg, sizeArg, search, center) => {
    const p = pageArg ?? page;
    const s = sizeArg ?? pageSize;

    const q = search ? `&search=${encodeURIComponent(search)}` : "";
    const c = center ? `&center=${encodeURIComponent(center)}` : "";

    // ALL === main listing (all statuses)
    if (status === "ALL") {
      return `${baseUrl}fulfillment?page=${p}&size=${s}${q}${c}`;
    }

    // Any specific STATUS (PENDING_FULFILLMENT, PROCESSING, etc.)
    return `${baseUrl}fulfillment/fulfil-status?page=${p}&size=${s}&status=${status}${q}${c}`;
  };

  // Open confirmation dialog
  const askConfirm = (id, action, label) => {
    setPendingAction({ id, action, label });
    setConfirmOpen(true);
  };

  // When user confirms
  const handleConfirm = async () => {
    if (pendingAction) {
      await doAction(pendingAction.id, pendingAction.action);
    }
    setConfirmOpen(false);
    setPendingAction(null);
  };

  // Cancel dialog
  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const fetchCounts = useCallback(async () => {
    try {
      const newCounts = { ...counts };

      // Get total count for ALL
      const allRes = await axios.get(
        `${baseUrl}fulfillment?page=0&size=1`,
        authHeaders
      );
      newCounts.ALL = allRes.data?.totalElements ?? 0;

      // Get counts for each status
      const statusKeys = [
        "PENDING_FULFILLMENT",
        "PROCESSING",
        "DISPATCHED",
        "FULFILLED",
        "CANCELLED",
      ];

      const results = await Promise.all(
        statusKeys.map((k) =>
          axios
            .get(
              `${baseUrl}fulfillment/fulfil-status?page=0&size=1&status=${k}`,
              authHeaders
            )
            .then((r) => ({ k, total: r.data?.totalElements ?? 0 }))
            .catch(() => ({ k, total: 0 }))
        )
      );

      results.forEach((r) => {
        newCounts[r.k] = r.total;
      });

      setCounts(newCounts);
    } catch (err) {
      console.error("Error fetching counts", err);
    }
  }, [token]);

  // ----------------------- FETCH RECORDS -----------------------
  const fetchRecords = useCallback(
    async (
      pageArg = page,
      pageSizeArg = pageSize,
      statusArg = activeTab,
      search = searchTerm,
      center = centerFilter
    ) => {
      setLoading(true);
      try {
        const url = buildUrl(statusArg, pageArg, pageSizeArg, search, center);

        console.log("Fetching URL:", url); // Debug log

        const response = await axios.get(url, authHeaders);

        const { content = [], totalElements = 0 } = response.data || {};
        const rows = content.map((rec, idx) => ({
          id: rec.id ?? idx,
          ...rec,
        }));

        setRecords(rows);
        setRowCount(totalElements);
      } catch (err) {
        console.error("Error fetching fulfillment records:", err);
        toast.error("Failed to load records");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, activeTab, searchTerm, centerFilter, token]
  );

  // ----------------------- INITIAL LOAD & DEPENDENCIES -----------------------
  useEffect(() => {
    fetchRecords(0, pageSize, activeTab, searchTerm, centerFilter);
    fetchCounts();
  }, [activeTab, searchTerm, centerFilter, pageSize]);

  // ----------------------- ACTION BUTTON HANDLERS -----------------------
  const doAction = async (id, endpoint) => {
    try {
      await axios.put(
        `${baseUrl}fulfillment/${id}/${endpoint}`,
        {},
        authHeaders
      );
      toast.success(`Updated: ${endpoint}`);
      fetchRecords();
      fetchCounts();
    } catch (err) {
      console.error("Action failed", err);
      toast.error("Action failed");
    }
  };

  // ----------------------- COLUMNS -----------------------
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "orderNumber", headerName: "Order ID", width: 120 },
    { field: "centerName", headerName: "Center", width: 180 },
    { field: "email", headerName: "Customer Email", width: 200 },

    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {
        const status = params.value;

        const statusLabel =
          {
            PENDING_FULFILLMENT: "Pending",
            PROCESSING: "Processing",
            DISPATCHED: "Dispatched",
            CANCELLED: "Cancelled",
            FULFILLED: "Order Completed",
          }[status] || status;

        const statusClass = status?.toLowerCase() || "";

        return <div className={`statusCell ${statusClass}`}>{statusLabel}</div>;
      },
    },

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
      field: "action",
      headerName: "Action",
      width: 250,
      sortable: false,
      renderCell: (params) => {
        const id = params.row.id;
        const status = params.row.status;

        const options = [];

        if (status === "PENDING_FULFILLMENT")
          options.push({ value: "processed", label: "Mark Processed" });

        if (status === "PROCESSING")
          options.push({ value: "dispatched", label: "Mark Dispatched" });

        if (status === "DISPATCHED")
          options.push({ value: "fulfilled", label: "Mark Fulfilled" });

        if (status !== "FULFILLED" && status !== "CANCELLED")
          options.push({ value: "failed", label: "Mark Failed" });

        if (status !== "FULFILLED" && status !== "CANCELLED")
          options.push({ value: "cancelled", label: "Cancel Order" });

        return (
          <select
            defaultValue=""
            style={{
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #ccc",
              minWidth: 180,
            }}
            onChange={(e) => {
              const action = e.target.value;
              if (!action) return;

              const labelMap = {
                processed: "Mark as Processed",
                dispatched: "Mark as Dispatched",
                fulfilled: "Mark as Fulfilled",
                failed: "Mark as Failed",
                cancelled: "Cancel Order",
              };

              const readable = labelMap[action] || action;

              // SHOW CONFIRM POPUP
              askConfirm(id, action, readable);

              e.target.value = "";
            }}
          >
            <option value="" disabled>
              Select Action
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  // ----------------------- TAB CLICK -----------------------
  const handleTabClick = (key) => {
    setActiveTab(key);
    setPage(0);
    // Explicitly pass the new tab key to fetch records
    fetchRecords(0, pageSize, key, searchTerm, centerFilter);
  };

  // ----------------------- UI RENDER -----------------------
  return (
    <div className="datatable">
      <div className="datatableTitle">Fulfillment Orders</div>

      {/* Search + Filters */}
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
          placeholder="Search by order id, email, center..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          style={{ padding: 8, minWidth: 260 }}
        />

        <select
          value={centerFilter}
          onChange={(e) => {
            setCenterFilter(e.target.value);
            setPage(0);
          }}
          style={{ padding: 8 }}
        >
          <option value="">All centers</option>
          {/* {centers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.centerName || c.farmName || c.name}
            </option>
          ))} */}
        </select>

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

      {/* Tabs */}
      <div
        className="tabsContainer"
        style={{ display: "flex", gap: 10, marginBottom: 12 }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabClick(t.key)}
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
            {t.label}{" "}
            <span style={{ marginLeft: 8, opacity: 0.9, fontWeight: 700 }}>
              ({counts[t.key] ?? 0})
            </span>
          </button>
        ))}
      </div>

      {/* DataGrid */}
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
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(0);
          fetchRecords(0, newPageSize, activeTab, searchTerm, centerFilter);
        }}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
      />
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to <strong>{pendingAction?.label}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Yes, Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FulfilmentOrder;
