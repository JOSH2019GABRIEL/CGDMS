import "./organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";

const Batch = () => {
  const [batchList, setBatchList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch batch with backend pagination
  const fetchBatch = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}batch?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((batch, index) => ({
        id: batch.id || index,
        ...batch,
      }));

      setBatchList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  useEffect(() => {
    fetchBatch(page, pageSize);
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}batch/archive/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBatchList(batchList.filter((batch) => batch.id !== id));
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "pondName", headerName: "Pond name", width: 200 },
    { field: "source", headerName: "Source", width: 150 },
    { field: "stockDate", headerName: "Stock Date", width: 200 },
    { field: "initialAvgWeightG", headerName: "Initial Average Weight", width: 200 },
    { field: "initialCount", headerName: "Initial Count", width: 150 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/batches/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">View</div>
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
        Batch
        <Link to="/dashboard/batches/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={batchList}
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

export default Batch;
