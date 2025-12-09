import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const SmokingTransfer = () => {
  const [smokeList, setSmokeList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchSmokedList = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}smoking-plant?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((smoke, index) => ({
        id: smoke.id || index,
        ...smoke,
      }));

      setSmokeList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching Smoke fish records:", error);
    }
  };

  useEffect(() => {
    fetchSmokedList(page, pageSize);
  }, [page, pageSize]);

  
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}smoking-plant/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSmokeList(smokeList.filter((smoke) => smoke.id !== id));
    } catch (error) {
      console.error("Error deleting Smoke fish record:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "smokingBatchId", headerName: "Smoking Batch ID", width: 160 },
    { field: "postHarvestId", headerName: "Post Harvest Batch ID", width: 180 },
     { field: "quantityReceivedKg", headerName: "Quantity Received (g)", width: 180 },
    
    { field: "processingLossKg", headerName: "Processing Loss (g)", width: 180 },
    { field: "smokedOutputKg", headerName: "Smoked Output (g)", width: 170 },
    { field: "qcInspectionStatus", headerName: "Quality Control Status", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/smoking-plant/${params.row.id}`}
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
        Fish Live Sale Records
        <Link to="/dashboard/smoking-plant/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={smokeList}
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

export default SmokingTransfer;
