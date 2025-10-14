import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";



const HarvestBatches = () => {
  const [harvestBatches, setHarvestBatches] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch harvest batches
  const fetchHarvestBatches = useCallback(
    async (page, pageSize) => {
      try {
        const response = await axios.get(
          `${baseUrl}harvest-batches?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const rows = content.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        setHarvestBatches(rows);
        setRowCount(totalElements);
      } catch (error) {
        console.error("Error fetching harvest batches:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchHarvestBatches(page, pageSize);
  }, [page, pageSize, fetchHarvestBatches]);

  // Handle delete (archive)
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}harvest-batches/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHarvestBatches(harvestBatches.filter((batch) => batch.id !== id));
    } catch (error) {
      console.error("Error deleting harvest batch:", error);
    }
  };

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "harvestedQtyKg", headerName: "Harvested Qty (Kg)", width: 180 },
    { field: "marketGrade", headerName: "Market Grade", width: 150 },
    { field: "packedQtyKg", headerName: "Packed Qty (Kg)", width: 180 },
    { field: "packType", headerName: "Pack Type", width: 150 },
    { field: "plotId", headerName: "Plot ID", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/harvest-batch/${params.row.id}`}
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
        Harvest Batches
        <Link to="/dashboard/harvest-batch/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={harvestBatches}
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

export default HarvestBatches;
