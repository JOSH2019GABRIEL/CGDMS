import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const EnvironmentLog = () => {
  const [envLogList, setEnvLogList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchEnvLogs = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}env-logs?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((log, index) => ({
        id: log.id || index,
        ...log,
      }));

      setEnvLogList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching environment logs:", error);
    }
  };

  useEffect(() => {
    fetchEnvLogs(page, pageSize);
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}env-logs/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnvLogList(envLogList.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Error deleting environment log:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "measuredAt", headerName: "Measured At", width: 200 },
    { field: "pondName", headerName: "Pond Name", width: 150 },
    { field: "temperatureC", headerName: "Temperature (°C)", width: 180 },
    { field: "dissolvedOxygenMgL", headerName: "Dissolved Oxygen (mg/L)", width: 200 },
    { field: "ph", headerName: "pH", width: 120 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/environment-log/${params.row.id}`}
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
        Environment Logs
        <Link to="/dashboard/environment-log/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={envLogList}
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

export default EnvironmentLog;
