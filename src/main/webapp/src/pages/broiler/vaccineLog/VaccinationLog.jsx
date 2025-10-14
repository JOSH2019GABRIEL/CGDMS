import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";



const VaccinationLog = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchVaccinations = useCallback(async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}vaccination-logs?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((vaccine, index) => ({
        id: vaccine.id || index, // ensure unique ID
        ...vaccine,
      }));

      setVaccinations(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching vaccination logs:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchVaccinations(page, pageSize);
  }, [page, pageSize, fetchVaccinations]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}vaccination-logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVaccinations(vaccinations.filter((vaccine) => vaccine.id !== id));
    } catch (error) {
      console.error("Error deleting vaccination log:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "fullFlock", headerName: "Flock ID", width: 150 },
    { field: "vaccineName", headerName: "Vaccine Name", width: 200 },
    { field: "dose", headerName: "Dose (ml/bird)", width: 150 },
    { field: "route", headerName: "Route", width: 250 },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/broiler-vaccination-log/${params.row.id}`}
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
        Vaccination Log
        <Link to="/dashboard/broiler-vaccination-log/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={vaccinations}
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

export default VaccinationLog;
