import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Order = () => {
  const [orderList, setOrderList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // ✅ Fetch Order Records
  const fetchOrders = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}order-place?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  // ✅ Delete (Archive) Order
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}order-place/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderList(orderList.filter((o) => o.id !== id));
    } catch (error) {
      console.error("Error archiving order:", error);
    }
  };

  // ✅ Order Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "orderNumber", headerName: "Order No", width: 180 },
    { field: "customerName", headerName: "Customer", width: 220 },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 180,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString(),
    },
    { field: "totalAmount", headerName: "Amount (₦)", width: 150 },
    {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      const status = params.value;

      const statusLabel = {
        PENDING_FULFILLMENT: "Pending",
        PROCESSING: "Processing",
        DISPATCHED: "Dispatched",
        CANCELLED: "Cancelled",
        FULFILLED: "Order Completed",
      }[status] || status;

      const statusClass = status?.toLowerCase() || "";

      return (
        <div className={`statusCell ${statusClass}`}>
          {statusLabel}
        </div>
      );
    },
  },

    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/order/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="editButton">
              <EditIcon style={{ marginRight: "5px" }} />
            </div>
          </Link>

          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon style={{ marginRight: "5px" }} />
          </div>
        </div>
      ),
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
    </div>
  );
};

export default Order;
