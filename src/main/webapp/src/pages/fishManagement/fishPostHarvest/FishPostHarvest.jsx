import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const FishPostHarvest = () => {
  const [postHarvestList, setPostHarvestList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch fish post-harvest records
  const fetchFishPostHarvest = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}fish-post-harvest?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((postHarvest, index) => ({
        id: postHarvest.id || index,
        ...postHarvest,
      }));

      setPostHarvestList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching fish post-harvest records:", error);
    }
  };

  useEffect(() => {
    fetchFishPostHarvest(page, pageSize);
  }, [page, pageSize]);

  // Delete or archive record
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}fish-postharvest/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPostHarvestList(postHarvestList.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting post-harvest record:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "destinationType", headerName: "Destination Type", width: 160 },
    { field: "quantityToLiveSaleKg", headerName: "Quantity To Live Sale (kg)", width: 180 },
    { field: "quantityToSmokingKg", headerName: "Quantity To Smoking (kg)", width: 180 },
    { field: "destinationBatchNo", headerName: "Destination Batch No", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/fish-post-harvest/${params.row.id}`}
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
        Fish Post-Harvest Records
        <Link to="/dashboard/fish-post-harvest/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={postHarvestList}
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

export default FishPostHarvest;
