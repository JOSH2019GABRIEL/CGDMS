import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const Wastes = () => {
  const [wastes, setWastes] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchWastes = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}wastes?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((item, index) => ({
        id: item.process_id || index, // ensure unique ID
        ...item,
      }));

      setWastes(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching wastes:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchWastes(page, pageSize);
  }, [page, pageSize, fetchWastes]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}wastes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWastes(wastes.filter((item) => item.process_id !== id));
    } catch (error) {
      console.error("Error deleting waste:", error);
    }
  };

  // DataGrid Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "processId", headerName: "ID", width: 70 },
    { field: "inedibleWasteKg", headerName: "Inedible Waste (kg)", width: 180 },
    { field: "packagingWasteKg", headerName: "Packaging Waste (kg)", width: 180 },
    { field: "effluentEstimateKg", headerName: "Effluent (kg)", width: 180 },
    { field: "disposalMethod", headerName: "Disposal Method", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/waste/${params.row.id}`}
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
        Wastes
        <Link to="/dashboard/waste/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={wastes}
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

export default Wastes;
