import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const WeightSamples = () => {
  const [samples, setSamples] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchSamples = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}weight-samples?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((sample, index) => ({
        id: sample.id || index, // ensure unique ID
        ...sample,
      }));

      setSamples(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching weight samples:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchSamples(page, pageSize);
  }, [page, pageSize, fetchSamples]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}weight-samples/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSamples(samples.filter((sample) => sample.id !== id));
    } catch (error) {
      console.error("Error deleting weight sample:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "flock_id", headerName: "Flock ID", width: 150 },
    { field: "sample_count", headerName: "Sample Count", width: 150 },
    { field: "avg_weight_g", headerName: "Avg Weight (g)", width: 180 },
    { field: "sd", headerName: "Standard Deviation", width: 200 },
    { field: "operator", headerName: "Operator", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/weight-samples/${params.row.id}`}
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
        Weight Samples
        <Link to="/dashboard/weight-samples/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={samples}
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

export default WeightSamples;
