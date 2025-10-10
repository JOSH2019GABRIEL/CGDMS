import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const Plots = () => {
  const [plots, setPlots] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch plots
  const fetchPlots = useCallback(
    async (page, pageSize) => {
      try {
        const response = await axios.get(
          `${baseUrl}plot?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const rows = content.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        setPlots(rows);
        setRowCount(totalElements);
      } catch (error) {
        console.error("Error fetching plots:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchPlots(page, pageSize);
  }, [page, pageSize, fetchPlots]);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}plot/archive/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlots(plots.filter((plot) => plot.id !== id));
    } catch (error) {
      console.error("Error deleting plot:", error);
    }
  };

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "type", headerName: "Plot Type", width: 180 },
    { field: "areaM2", headerName: "Size (M2)", width: 160 },
    { field: "soilType", headerName: "Soil Type", width: 200 },
    { field: "farmName", headerName: "Farm", width: 200 },
    { field: "bedLayout", headerName: "Bed Layout", width: 200 },
    
    
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/plot/${params.row.id}`}
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
        Plots
        <Link to="/dashboard/plot/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={plots}
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

export default Plots;
