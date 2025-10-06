import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const ThinningEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchEvents = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}thinning-events?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((event, index) => ({
        id: event.id || index, // ensure unique ID
        ...event,
      }));

      setEvents(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching thinning events:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchEvents(page, pageSize);
  }, [page, pageSize, fetchEvents]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}thinning-events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting thinning event:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "flockId", headerName: "Flock ID", width: 150 },
    { field: "numberRemoved", headerName: "Number Removed", width: 180 },
    { field: "averageWeight", headerName: "Average Weight (kg)", width: 200 },
    { field: "destination", headerName: "Destination", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/thinning-event/${params.row.id}`}
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
        Thinning Events
        <Link to="/dashboard/thinning-event/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={events}
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

export default ThinningEvents;
