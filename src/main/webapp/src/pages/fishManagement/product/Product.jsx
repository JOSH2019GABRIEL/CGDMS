import "../../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  // ✅ Fetch product records
  const fetchProducts = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}product?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((product, index) => ({
        id: product.id || index,
        ...product,
      }));

      setProductList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching product records:", error);
    }
  };

  useEffect(() => {
    fetchProducts(page, pageSize);
  }, [page, pageSize]);

  // ✅ Delete or archive product record
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}product/archive/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProductList(productList.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product record:", error);
    }
  };

  // ✅ Product table columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "sku", headerName: "Product Code", width: 200 },
    { field: "productName", headerName: "Name", width: 200 },
    { field: "categoryName", headerName: "Category", width: 180 },
    { field: "unitPrice", headerName: "Unit Price (₦)", width: 180 },
    { field: "unitSizeG", headerName: "Stock Qty", width: 150 },
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
    { field: "action", headerName: "Action", width: 180,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/product/${params.row.id}`}
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
        Product Records
        <Link to="/dashboard/product/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={productList}
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

export default Product;
