import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const SlaughterLog = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchLogs = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}slaughter-logs?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((log, index) => ({
        id: log.process_id || index, // ensure unique row ID
        ...log,
      }));

      setLogs(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching slaughter logs:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchLogs(page, pageSize);
  }, [page, pageSize, fetchLogs]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}slaughter-logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLogs(logs.filter((log) => log.process_id !== id));
    } catch (error) {
      console.error("Error deleting slaughter log:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "Process ID", width: 150 },
    { field: "birdsReceived", headerName: "Birds Received", width: 180 },
    { field: "birdsSlaughtered", headerName: "Birds Slaughtered", width: 200 },
    { field: "condemnedCount", headerName: "Condemned Count", width: 200 },
    { field: "reason", headerName: "Reason", width: 250 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/slaughter-log/${params.row.id}`}
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
        Slaughter Logs
        <Link to="/dashboard/slaughter-log/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={logs}
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

export default SlaughterLog;
