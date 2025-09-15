import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";

const MedicationLog = () => {
  const [medicationLogList, setMedicationLogList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchMedicationLogs = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}medication-logs?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((med, index) => ({
        id: med.id || index,
        ...med,
      }));

      setMedicationLogList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching medication logs:", error);
    }
  };

  useEffect(() => {
    fetchMedicationLogs(page, pageSize);
  }, [page, pageSize]);

  //TODO:
  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}batch/archive/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedicationLogList(medicationLogList.filter((med) => med.id !== id));
    } catch (error) {
      console.error("Error deleting medication log:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "treatmentDate", headerName: "Date of Treatment", width: 200 },
    { field: "pondName", headerName: "Pond Name", width: 150 },
    { field: "diagnosis", headerName: "Diagnosis", width: 150 },
    { field: "medication", headerName: "Medication", width: 200 },
    { field: "dosage", headerName: "Dosage", width: 200 },
    { field: "method", headerName: "Method", width: 200 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/medication-log/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">View</div>
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
        Feed Log
        <Link to="/dashboard/medication-log/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={medicationLogList}
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

export default MedicationLog;
