import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";



const PostLossHarvest = () => {
  const [postlossHarvests, setPostlossHarvests] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch post-loss harvest records
  const fetchPostlossHarvests = useCallback(
    async (page, pageSize) => {
      try {
        const response = await axios.get(
          `${baseUrl}postharvest-losses?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const rows = content.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        setPostlossHarvests(rows);
        setRowCount(totalElements);
      } catch (error) {
        console.error("Error fetching post-loss harvests:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchPostlossHarvests(page, pageSize);
  }, [page, pageSize, fetchPostlossHarvests]);

  // Handle delete (archive)
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}postharvest-losses/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPostlossHarvests(postlossHarvests.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting post-loss harvest record:", error);
    }
  };

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "spoilageKg", headerName: "Spoilage (Kg)", width: 150 },
    { field: "trimmingWasteKg", headerName: "Trimming Waste (Kg)", width: 180 },
    { field: "pestsDamageKg", headerName: "Pests Damage (Kg)", width: 180 },
    { field: "harvestBatchId", headerName: "Harvest Batch ID", width: 160 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/postloss-harvest/${params.row.id}`}
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
        Post-Loss Harvest
        <Link to="/dashboard/postloss-harvest/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={postlossHarvests}
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

export default PostLossHarvest;
