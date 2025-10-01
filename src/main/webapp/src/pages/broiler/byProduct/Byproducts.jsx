import "../../style/organization.scss";
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
    { field: "process_id", headerName: "Process ID", width: 150 },
    { field: "offal_liver_kg", headerName: "Liver (kg)", width: 150 },
    { field: "offal_gizzard_kg", headerName: "Gizzard (kg)", width: 150 },
    { field: "offal_heart_kg", headerName: "Heart (kg)", width: 150 },
    { field: "blood_ltr", headerName: "Blood (ltr)", width: 150 },
    { field: "feathers_kg", headerName: "Feathers (kg)", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/byproducts/${params.row.process_id}`}
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
        Byproducts
        <Link to="/dashboard/byproducts/new" className="link">
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
