import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const Byproducts = () => {
  const [byproducts, setByproducts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchByproducts = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}byproducts?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((item, index) => ({
        id: item.process_id || index, // ensure unique ID
        ...item,
      }));

      setByproducts(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching byproducts:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchByproducts(page, pageSize);
  }, [page, pageSize, fetchByproducts]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}byproducts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setByproducts(byproducts.filter((item) => item.process_id !== id));
    } catch (error) {
      console.error("Error deleting byproduct:", error);
    }
  };

  // DataGrid Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "processingBatchId", headerName: "Process ID", width: 150 },
    { field: "liverKg", headerName: "Liver (kg)", width: 150 },
    { field: "gizzardKg", headerName: "Gizzard (kg)", width: 150 },
    { field: "heartKg", headerName: "Heart (kg)", width: 150 },
    { field: "bloodLtr", headerName: "Blood (ltr)", width: 150 },
    { field: "feathersKg", headerName: "Feathers (kg)", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/by-product/${params.row.id}`}
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
        Byproducts
        <Link to="/dashboard/by-product/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={byproducts}
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

export default Byproducts;
