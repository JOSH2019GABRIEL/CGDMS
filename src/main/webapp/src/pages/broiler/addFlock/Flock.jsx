import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const Flock = () => {
  const [flockList, setFlockList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchFlocks = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}flocks?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((flock, index) => ({
        id: flock.flock_id || index, // ensure unique ID
        ...flock,
      }));

      setFlockList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching flocks:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchFlocks(page, pageSize);
  }, [page, pageSize, fetchFlocks]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}flocks/archive/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFlockList(flockList.filter((flock) => flock.flock_id !== id));
    } catch (error) {
      console.error("Error deleting flock:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "flock_id", headerName: "Flock ID", width: 120 },
    { field: "house_id", headerName: "House ID", width: 150 },
    { field: "source", headerName: "Source", width: 150 },
    { field: "hatch_date", headerName: "Hatch Date", width: 180 },
    { field: "stocking_count", headerName: "Stocking Count", width: 180 },
    { field: "sex_ratio", headerName: "Sex Ratio", width: 150 },
    { field: "expected_cycle_days", headerName: "Cycle Days", width: 150 },
    { field: "target_weight", headerName: "Target Weight (kg)", width: 180 },
    { field: "vaccine_profile", headerName: "Vaccine Profile", width: 200 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/flocks/${params.row.flock_id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">Edit</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row.flock_id)}
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
        Flocks
        <Link to="/dashboard/flocks/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={flockList}
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

export default Flock;
