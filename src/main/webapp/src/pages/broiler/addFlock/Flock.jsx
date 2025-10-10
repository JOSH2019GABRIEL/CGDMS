import "../../../style/organization.scss";

import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const Flock = () => {
  const [flockList, setFlockList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

 const fetchFlocks = async (page, pageSize) => {
  try {
    const response = await axios.get(
      `${baseUrl}flocks?page=${page}&size=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const { content, totalElements } = response.data;

    console.log("Fetched flocks:", content);
      const rows = content.map((flock, index) => ({
        id: flock.id || index,
        ...flock,
      }));
      console.log(content)
      setFlockList(rows);
    setRowCount(totalElements);
  } catch (error) {
    console.error("Error fetching flocks:", error);
  }
};


  useEffect(() => {
    fetchFlocks(page, pageSize);
  }, [page, pageSize]);

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
    { field: "id", headerName: "Flock ID", width: 120 },
    { field: "farmName", headerName: "House ID", width: 150 },
    { field: "source", headerName: "Source", width: 150 },
    { field: "hatchDate", headerName: "Hatch Date", width: 180 },
    { field: "stockingCount", headerName: "Stocking Count", width: 180 },
    { field: "sexRatio", headerName: "Sex Ratio", width: 150 },
    { field: "expectedCycleDays", headerName: "Cycle Days", width: 150 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/flock/${params.row.id}`}
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
        Flocks
        <Link to="/dashboard/flock/new" className="link">
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
