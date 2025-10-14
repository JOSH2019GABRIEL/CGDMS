import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";



const ProcessingBatch = () => {
  const [batches, setBatches] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchBatches = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}processing-batches?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((batch, index) => ({
        id: batch.process_id || index, // ensure unique ID
        ...batch,
      }));

      setBatches(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching processing batches:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchBatches(page, pageSize);
  }, [page, pageSize, fetchBatches]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}processing-batches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBatches(batches.filter((batch) => batch.process_id !== id));
    } catch (error) {
      console.error("Error deleting processing batch:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "plantLocation", headerName: "Plant Location", width: 200 },
    // { field: "operator", headerName: "Operator", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/processing-batch/${params.row.id}`}
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
        Processing Batches
        <Link to="/dashboard/processing-batch/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={batches}
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

export default ProcessingBatch;
