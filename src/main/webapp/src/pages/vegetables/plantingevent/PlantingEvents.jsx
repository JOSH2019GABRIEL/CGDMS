import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const PlantingEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch planting events
  const fetchEvents = useCallback(
    async (page, pageSize) => {
      try {
        const response = await axios.get(
          `${baseUrl}planting-events?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const rows = content.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        setEvents(rows);
        setRowCount(totalElements);
      } catch (error) {
        console.error("Error fetching planting events:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchEvents(page, pageSize);
  }, [page, pageSize, fetchEvents]);

  // Handle delete (archive)
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}planting-events/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error archiving planting event:", error);
    }
  };

  // Table columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "seedBatch", headerName: "Seed Batch", width: 180 },
    { field: "seedCount", headerName: "Seed Count", width: 150 },
    { field: "expectedHarvestDate", headerName: "Expected Harvest Date", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/planting-event/${params.row.id}`}
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
        Planting Events
        <Link to="/dashboard/planting-event/new" className="link">
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

export default PlantingEvents;
