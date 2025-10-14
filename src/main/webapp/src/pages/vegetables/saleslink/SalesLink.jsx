import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const SalesLink = () => {
  const [salesLinks, setSalesLinks] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // ✅ Fetch sales records
  const fetchSalesLinks = useCallback(
    async (page, pageSize) => {
      try {
        const response = await axios.get(
          `${baseUrl}sales-links?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const rows = content.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        setSalesLinks(rows);
        setRowCount(totalElements);
      } catch (error) {
        console.error("Error fetching sales records:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchSalesLinks(page, pageSize);
  }, [page, pageSize, fetchSalesLinks]);

  // ✅ Handle delete (archive)
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}sales/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSalesLinks(salesLinks.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting sales record:", error);
    }
  };

  // ✅ Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "salesInvoice", headerName: "Sales Invoice", width: 200 },
    { field: "marketDestination", headerName: "Market Destination", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/sales/${params.row.id}`}
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
        Sales Records
        <Link to="/dashboard/sales/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={salesLinks}
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

export default SalesLink;
