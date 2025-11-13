import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const FishHarvest = () => {
  const [harvestList, setHarvestList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch fish harvest records
  const fetchFishHarvest = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}fish-harvest?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((harvest, index) => ({
        id: harvest.id || index,
        ...harvest,
      }));

      setHarvestList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching fish harvest logs:", error);
    }
  };

  useEffect(() => {
    fetchFishHarvest(page, pageSize);
  }, [page, pageSize]);

  // Delete or archive
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}fish-harvest/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHarvestList(harvestList.filter((harvest) => harvest.id !== id));
    } catch (error) {
      console.error("Error deleting fish harvest record:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "harvestDate", headerName: "Harvest Date", width: 150 },
    { field: "harvestOfficer", headerName: "Harvest Officer", width: 180 },
    { field: "pondId", headerName: "Pond ID", width: 120 },
    { field: "batchId", headerName: "Batch ID", width: 120 },
    { field: "productionCycle", headerName: "Cycle", width: 130 },
    { field: "totalFishHarvested", headerName: "Total Fish", width: 150 },
    { field: "averageWeightKg", headerName: "Avg Weight (kg)", width: 150 },
    { field: "totalWeightKg", headerName: "Total Weight (kg)", width: 160 },
    {
      field: "mortalityDuringHarvest",
      headerName: "Mortality (kg)",
      width: 150,
    },
    { field: "gradingCategory", headerName: "Grading", width: 150 },

    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/fish-harvest/${params.row.id}`}
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
        Fish Harvest Records
        <Link to="/dashboard/fish-harvest/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={harvestList}
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

export default FishHarvest;
