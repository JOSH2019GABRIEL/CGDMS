import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const CropLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch crop logs
  const fetchLogs = useCallback(
    async (page, pageSize) => {
      try {
        const response = await axios.get(
          `${baseUrl}crop-logs?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const rows = content.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        setLogs(rows);
        setRowCount(totalElements);
      } catch (error) {
        console.error("Error fetching crop logs:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchLogs(page, pageSize);
  }, [page, pageSize, fetchLogs]);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}crop-logs/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(logs.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Error deleting crop log:", error);
    }
  };

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "cropStage", headerName: "Crop Stage", width: 180 },
    { field: "irrigationL", headerName: "Irrigation (L)", width: 160 },
    { field: "fertilizerG", headerName: "Fertilizer (g)", width: 160 },
    { field: "pesticideApplied", headerName: "Pesticide Applied", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/veg-crop-log/${params.row.id}`}
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
        Crop Logs
        <Link to="/dashboard/veg-crop-log/new" className="link">
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

export default CropLogs;
