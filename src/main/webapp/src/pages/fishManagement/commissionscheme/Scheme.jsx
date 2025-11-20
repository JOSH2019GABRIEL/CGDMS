import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Scheme = () => {
  const [schemeList, setSchemeList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // ✅ Fetch scheme records
  const fetchSchemes = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}commission-scheme?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((scheme, index) => ({
        id: scheme.id || index,
        ...scheme,
      }));

      setSchemeList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching scheme records:", error);
    }
  };

  useEffect(() => {
    fetchSchemes(page, pageSize);
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}commission-scheme/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSchemeList(schemeList.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error archiving scheme:", error);
    }
  };

  // ✅ Scheme table columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "schemeName", headerName: "Scheme Name", width: 220 },
    { field: "description", headerName: "Description", width: 280 },

    {
      field: "isActive",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div
          className={`statusCell ${
            params.value === true ? "Active" : "Inactive"
          }`}
        >
          {params.value === true ? "Active" : "Inactive"}
        </div>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div className="cellAction">
          {/* EDIT */}
          <Link
            to={`/dashboard/scheme/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="editButton">
              <EditIcon style={{ marginRight: "5px" }} />
            </div>
          </Link>

          {/* ARCHIVE */}
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
        Commission Scheme Records
        <Link to="/dashboard/scheme/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={schemeList}
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

export default Scheme;
