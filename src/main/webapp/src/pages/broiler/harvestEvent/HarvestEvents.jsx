import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";



const HarvestEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchEvents = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}harvest-events?page=${page}&size=${pageSize}`,
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
      console.error("Error fetching harvest events:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchEvents(page, pageSize);
  }, [page, pageSize, fetchEvents]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}harvest-events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting harvest event:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "fullFlock", headerName: "Flock ID", width: 150 },
    { field: "totalHarvested", headerName: "Total Harvested", width: 180 },
    { field: "averageLiveWeight", headerName: "Average Live Weight (kg)", width: 220 },
    { field: "cullCount", headerName: "Cull Count", width: 150 },
    // { field: "operator", headerName: "Operator", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/harvest-event/${params.row.id}`}
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
        Harvest Events
        <Link to="/dashboard/harvest-event/new" className="link">
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

export default HarvestEvents;
