import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";

const FishPerformance = () => {
  const [performanceList, setPerformanceList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchFishPerformance = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}fish-performance?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((perf, index) => ({
        id: perf.id || index,
        ...perf,
      }));

      setPerformanceList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching fish performance logs:", error);
    }
  };

  useEffect(() => {
    fetchFishPerformance(page, pageSize);
  }, [page, pageSize]);

  //TODO: handle archive/delete
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}fish-performance/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPerformanceList(performanceList.filter((perf) => perf.id !== id));
    } catch (error) {
      console.error("Error deleting fish performance log:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "date", headerName: "Record Date", width: 180 },
    { field: "pondName", headerName: "Pond Name", width: 150 },
    { field: "avgWeightG", headerName: "Avg Weight (g)", width: 150 },
    { field: "liveCount", headerName: "Live Count", width: 120 },
    { field: "biomassKg", headerName: "BioMass (kg)", width: 180 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/fish-performance/${params.row.id}`}
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
        Fish Performance Log
        <Link to="/dashboard/fish-performance/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={performanceList}
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

export default FishPerformance;
