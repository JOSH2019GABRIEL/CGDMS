import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const BatchMovement = () => {
  const [batchMovementList, setbatchMovementList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchBatchMovement = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}batch-movements?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((batch, index) => ({
        id: batch.id || index,
        ...batch,
      }));

      setbatchMovementList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching batch movement:", error);
    }
  };

  useEffect(() => {
    fetchBatchMovement(page, pageSize);
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}batch/archive/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setbatchMovementList(batchMovementList.filter((batch) => batch.id !== id));
    } catch (error) {
      console.error("Error deleting batch movement:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "batchId", headerName: "Batch ID", width: 200 },
    { field: "batchSource", headerName: "Batch source", width: 150 },
    { field: "fromPondName", headerName: "Moved from", width: 200 },
    { field: "toPondName", headerName: "Moved to", width: 200 },
    { field: "movedCount", headerName: "Total Moved", width: 200 },
    { field: "movementDate", headerName: "Movement date", width: 150 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/batch-movement/${params.row.id}`}
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
        Batch Movement
        <Link to="/dashboard/batch-movement/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={batchMovementList}
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

export default BatchMovement;
