import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const Pond = () => {
  const [pondList, setPondList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");
  const roles = localStorage.getItem("roles");
  const isAdmin = roles.includes("ROLE_ADMIN");

  // Fetch ponds with backend pagination
  const fetchPonds = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}ponds?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((pond, index) => ({
        id: pond.id || index,
        ...pond,
      }));
      console.log(content)

      setPondList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching ponds:", error);
    }
  };

  useEffect(() => {
    fetchPonds(page, pageSize);
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}pond/archive/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPondList(pondList.filter((pond) => pond.id !== id));
    } catch (error) {
      console.error("Error deleting pond:", error);
    }
  };


  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "capacity", headerName: "Capacity", width: 150 },
    { field: "location", headerName: "Location", width: 200 },
    { field: "availableFingerlin", headerName: "available Fingerlin", width: 150 },
    { field: "status", headerName: "Status", width: 150 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/pond/${params.row.id}`}
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
        Ponds
        <Link to="/dashboard/pond/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={pondList}
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

export default Pond;
