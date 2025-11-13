import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const FishLiveSale = () => {
  const [saleList, setSaleList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // ✅ Fetch fish live sale records
  const fetchFishLiveSales = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}fish-live-sales?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((sale, index) => ({
        id: sale.id || index,
        ...sale,
      }));

      setSaleList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching fish live sale records:", error);
    }
  };

  useEffect(() => {
    fetchFishLiveSales(page, pageSize);
  }, [page, pageSize]);

  // ✅ Delete or archive sale record
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}fish-live-sales/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaleList(saleList.filter((sale) => sale.id !== id));
    } catch (error) {
      console.error("Error deleting fish live sale record:", error);
    }
  };

  // ✅ Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "postHarvestId", headerName: "Post-Harvest ID", width: 160 },
    { field: "buyName", headerName: "Buyer Name", width: 180 },
    { field: "salePricePerKg", headerName: "Price/Kg (₦)", width: 150 },
    { field: "totalSaleValue", headerName: "Total Sale (₦)", width: 160 },
    { field: "paymentStatus", headerName: "Payment Status", width: 150 },
    { field: "invoiceNo", headerName: "Invoice No", width: 150 },
    { field: "dispatchMethod", headerName: "Dispatch Method", width: 180 },

    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/fish-sale/${params.row.id}`}
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
        Fish Live Sale Records
        <Link to="/dashboard/fish-sale/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={saleList}
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

export default FishLiveSale;
