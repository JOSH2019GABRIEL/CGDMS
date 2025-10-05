import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const MedicationLogs = () => {
  const [medications, setMedications] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchMedications = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}medication-log?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((med, index) => ({
        id: med.id || index, // ensure unique ID
        ...med,
      }));

      setMedications(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching medication logs:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchMedications(page, pageSize);
  }, [page, pageSize, fetchMedications]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}medication-log/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedications(medications.filter((med) => med.id !== id));
    } catch (error) {
      console.error("Error deleting medication log:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "flock_id", headerName: "Flock ID", width: 150 },
    { field: "drug", headerName: "Drug", width: 200 },
    { field: "dose", headerName: "Dose", width: 150 },
    { field: "route", headerName: "Route", width: 150 },
    { field: "withdrawal_days", headerName: "Withdrawal Days", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/medication-log/${params.row.id}`}
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
        Medication Log
        <Link to="/dashboard/medication-log/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={medications}
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

export default MedicationLogs;
