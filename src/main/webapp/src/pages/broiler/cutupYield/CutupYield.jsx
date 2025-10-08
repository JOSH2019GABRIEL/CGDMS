import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const CutupYield = () => {
  const [yields, setYields] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchYields = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}cutup-yields?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((yieldItem, index) => ({
        id: yieldItem.process_id || index, // unique row ID
        ...yieldItem,
      }));

      setYields(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching cutup yield:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchYields(page, pageSize);
  }, [page, pageSize, fetchYields]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}cutup-yield/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setYields(yields.filter((item) => item.process_id !== id));
    } catch (error) {
      console.error("Error deleting cutup yield:", error);
    }
  };

  // DataGrid Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "processingBatchId", headerName: "Process ID", width: 150 },
    { field: "wholeBirdsCount", headerName: "Whole Birds Count", width: 200 },
    { field: "breastKg", headerName: "Breast (kg)", width: 150 },
    { field: "thighKg", headerName: "Thigh (kg)", width: 150 },
    { field: "wingKg", headerName: "Wing (kg)", width: 150 },
    { field: "drumstickKg", headerName: "Drumstick (kg)", width: 180 },
    { field: "carcassKg", headerName: "Carcass (kg)", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/cutup-yield/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">Edit</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Cut-up Yield
        <Link to="/dashboard/cutup-yield/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={yields}
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

export default CutupYield;
