import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");
  const ROLE = localStorage.getItem("role");
  console.log("Role is ", ROLE);

  const fetchStaffs = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}staff?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((staff, index) => ({
        id: staff.id || index,
        ...staff,
      }));

      setStaffList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching staff users:", error);
    }
  };

  useEffect(() => {
    fetchStaffs(page, pageSize);
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${baseUrl}staff/archive/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStaffList(staffList.filter((staff) => staff.id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "firstname", headerName: "First Name", width: 200 },
    { field: "lastname", headerName: "Last Name", width: 200 },
    { field: "cadre", headerName: "Staff Cadre", width: 150 },
    { field: "rate", headerName: "Staff Rate (₦)", width: 150 },
    { field: "phone", headerName: "Phone Number", width: 200 },
    { field: "email", headerName: "Email Address", width: 200 },
    { field: "enabled", headerName: "Account Status", width: 150 },

    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/staff-user/${params.row.id}`}
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
          {/* <div
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            Activate Account
          </div> */}
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Staffs
        <Link to="/dashboard/staff-user/change-password" className="link">
          Change Password
        </Link>
        <Link to="/dashboard/staff-user/new" className="link">
          Reset Password
        </Link>
        <Link to="/dashboard/staff-user/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={staffList}
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

export default Staff;
