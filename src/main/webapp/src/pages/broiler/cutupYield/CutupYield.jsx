imimport "../../../style/organization.scss";
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
        `${baseUrl}cutup-yield?page=${page}&size=${pageSize}`,
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
    { field: "process_id", headerName: "Process ID", width: 150 },
    { field: "whole_birds_count", headerName: "Whole Birds Count", width: 200 },
    { field: "breast_kg", headerName: "Breast (kg)", width: 150 },
    { field: "thigh_kg", headerName: "Thigh (kg)", width: 150 },
    { field: "wing_kg", headerName: "Wing (kg)", width: 150 },
    { field: "drumstick_kg", headerName: "Drumstick (kg)", width: 180 },
    { field: "carcass_kg", headerName: "Carcass (kg)", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/cutup-yield/${params.row.process_id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">Edit</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row.process_id)}
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
