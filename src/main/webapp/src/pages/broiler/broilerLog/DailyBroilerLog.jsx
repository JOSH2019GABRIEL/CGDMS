import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const DailyBroilerLog = () => {
  const [logList, setLogList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch logs with pagination
  const fetchLogs = useCallback(
    async (page, pageSize) => {
      try {
        const response = await axios.get(
          `${baseUrl}daily-flock-log?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const rows = content.map((log, index) => ({
          id: log.id || index, // ensure unique ID for DataGrid
          ...log,
        }));

        setLogList(rows);
        setRowCount(totalElements);
      } catch (error) {
        console.error("Error fetching daily broiler logs:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchLogs(page, pageSize);
  }, [page, pageSize, fetchLogs]);

  // Handle delete (archive)
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}daily-flock-log/archive/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLogList(logList.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  };

  // DataGrid columns
  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "fullFlock", headerName: "Flock Tracker", width: 150 },
    { field: "feedType", headerName: "Feed Type", width: 150 },
    { field: "feedQtyKg", headerName: "Feed Qty (kg)", width: 150 },
    { field: "waterCheck", headerName: "Water Check", width: 180 },
    { field: "temp", headerName: "Temperature (°C)", width: 180 },
    { field: "mortalityCount", headerName: "Mortality Count", width: 180 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/broiler-log/${params.row.id}`}
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
        Daily Broiler Logs
        <Link to="/dashboard/broiler-log/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={logList}
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

export default DailyBroilerLog;
