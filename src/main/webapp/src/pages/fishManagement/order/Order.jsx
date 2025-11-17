import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

// MUI Dialog
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const Order = () => {
  const [orderList, setOrderList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  // -------------------- MODAL STATES --------------------
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null); // "delete" or "cancel"
  const [selectedId, setSelectedId] = useState(null);

  const openConfirmDialog = (action, id) => {
    setDialogAction(action);
    setSelectedId(id);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setDialogAction(null);
    setSelectedId(null);
  };

  // -------------------- FETCH ORDERS --------------------
  const fetchOrders = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}order-place?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((order, index) => ({
        id: order.id || index,
        ...order,
      }));

      setOrderList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching order records:", error);
    }
  };

  useEffect(() => {
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  // -------------------- DELETE ORDER --------------------
  const handleDelete = async () => {
    try {
      await axios.put(
        `${baseUrl}order-place/archive/${selectedId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderList(orderList.filter((o) => o.id !== selectedId));
    } catch (error) {
      console.error("Error archiving order:", error);
    } finally {
      closeDialog();
    }
  };

  // -------------------- CANCEL ORDER --------------------
 const handleCancelOrder = async () => {
  try {
    await axios.put(
      `${baseUrl}order-place/${selectedId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setOrderList(orderList.filter((o) => o.id !== selectedId));
    toast.success("Order cancelled successfully!");

    setTimeout(() => navigate("/dashboard/orders"), 1000);

  } catch (error) {
    console.error("Error cancelling order:", error);
    toast.error("Failed to cancel order.");
  } finally {
    closeDialog();
  }
};


  // -------------------- COLUMNS --------------------
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "orderNumber", headerName: "Order No", width: 180 },
    { field: "customerName", headerName: "Customer", width: 220 },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 180,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "totalAmount", headerName: "Amount (₦)", width: 150 },

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

    // ACTION BUTTONS
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const status = params.row.status;
        const id = params.row.id;

        return (
          <div className="cellAction">
            {/* VIEW / EDIT */}
            <Link
              to={`/dashboard/order/${id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="editButton">
                <EditIcon />
              </div>
            </Link>

            {/* DELETE */}
            <div
              className="deleteButton"
              onClick={() => openConfirmDialog("delete", id)}
            >
              <DeleteIcon />
            </div>

            {/* CANCEL — Only show if NOT fulfilled & NOT cancelled */}
            {status !== "FULFILLED" && status !== "CANCELLED" && (
              <div
                className="deleteButton"
                onClick={() => openConfirmDialog("cancel", id)}
              >
                <NotInterestedIcon />
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Order Records
        <Link to="/dashboard/order/new" className="link">
          Create Order
        </Link>
      </div>

      {/* -------------------- DATA TABLE -------------------- */}
      <DataGrid
        className="datagrid"
        rows={orderList}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
      />

      {/* -------------------- MODAL DIALOG -------------------- */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {dialogAction === "delete" ? "Archive Order" : "Cancel Order"}
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            <strong>
              {dialogAction === "delete"
                ? "archive this order?"
                : "cancel this order?"}
            </strong>
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} color="inherit">
            No, Go Back
          </Button>

          {dialogAction === "delete" ? (
            <Button onClick={handleDelete} color="error" variant="contained">
              Yes, Archive
            </Button>
          ) : (
            <Button
              onClick={handleCancelOrder}
              color="error"
              variant="contained"
            >
              Yes, Cancel Order
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Order;
