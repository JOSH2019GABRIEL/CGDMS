import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const CropVarieties = () => {
  const [varieties, setVarieties] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch crop varieties
  const fetchVarieties = useCallback(
    async (page, pageSize) => {
      try {
        const response = await axios.get(
          `${baseUrl}crop-varieties?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const rows = content.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        setVarieties(rows);
        setRowCount(totalElements);
      } catch (error) {
        console.error("Error fetching crop varieties:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchVarieties(page, pageSize);
  }, [page, pageSize, fetchVarieties]);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}crop-varieties/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVarieties(varieties.filter((variety) => variety.id !== id));
    } catch (error) {
      console.error("Error deleting crop variety:", error);
    }
  };

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "cropName", headerName: "Crop Name", width: 200 },
    { field: "variety", headerName: "Variety", width: 200 },
    { field: "seedRateGPerM2", headerName: "Seed Rate (g/m²)", width: 180 },
    {field: "expectedDaysToHarvest", headerName: "Days to Harvest", width: 180},
    {field: "greenhouseDaysAdjustment", headerName: "Greenhouse Adj. (Days)", width: 200},
    { field: "spacing", headerName: "Spacing", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/crop-variety/${params.row.id}`}
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
        Crop Varieties
        <Link to="/dashboard/crop-variety/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={varieties}
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

export default CropVarieties;
