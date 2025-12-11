import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { url as baseUrl } from "../../../api";

const NominalLoss = () => {
  const [lossList, setLossList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // ✅ Fetch nominal loss records
  const fetchNominalLoss = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}nominal-loss?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((item, index) => ({
        id: item.id || index,
        ...item,
      }));

      setLossList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching nominal loss records:", error);
    }
  };

  useEffect(() => {
    fetchNominalLoss(page, pageSize);
  }, [page, pageSize]);

  // ✅ Delete/Archive a nominal loss
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}nominal-loss/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLossList(lossList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting nominal loss:", error);
    }
  };

  // ✅ DataGrid Columns
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "rate", headerName: "Rate Type", width: 150 },
    { field: "category", headerName: "Category", width: 120 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "value", headerName: "Value", width: 120 },

    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/nominal-loss/${params.row.id}`}
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
        Nominal Loss Records
        <Link to="/dashboard/nominal-loss/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={lossList}
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

export default NominalLoss;
