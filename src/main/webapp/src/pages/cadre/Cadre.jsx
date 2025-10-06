import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";

const Cadre = () => {
  const [cadres, setCadres] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch cadres with pagination
  const fetchCadres = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}cadres?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((cadre, index) => ({
        id: cadre.id || index,
        ...cadre,
      }));

      setCadres(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching cadres:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchCadres(page, pageSize);
  }, [page, pageSize, fetchCadres]);

  // Delete handler
  const handleDelete = async (id) => {
  try {
    await axios.put(
      `${baseUrl}cadres/archive/${id}`,
      {}, // no body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // remove from UI list
    setCadres((prevCadres) => prevCadres.filter((c) => c.id !== id));
    toast.success("Cadre delete successfully!",
        {
        position: "top-right",
        autoClose: 3000,
      }
    );
  } catch (error) {
    console.error("Error archiving cadre:", error);
    toast.error(error.response?.data?.message || "Failed to archive cadre.", 
        {
        position: "top-right",
        autoClose: 3000,
      }
    );
  }
};


  // DataGrid column definitions
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "cadreName", headerName: "Cadre Name", width: 200 },
    { field: "paymentType", headerName: "Payment Type", width: 180 },
    { field: "farmName", headerName: "Farm name", width: 180 },
    { field: "rate", headerName: "Cadre rate", width: 180 },
    { field: "paymentType", headerName: "Payment Type", width: 180 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/cadre/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">Edit</div>
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
        Cadre Management
        <Link to="/dashboard/cadre/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={cadres}
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

export default Cadre;
