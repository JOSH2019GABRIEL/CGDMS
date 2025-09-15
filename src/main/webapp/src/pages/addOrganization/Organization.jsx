import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";

const Organization = () => {
  const [organizationList, setOrganizationList] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${baseUrl}organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rows = response.data.map((org, index) => ({
        id: org.id || index, 
        ...org,
      }));

      setOrganizationList(rows);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}organizations/archive/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("action Hit ", `${id}`)
      setOrganizationList(organizationList.filter((org) => org.id !== id));
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "contactEmail", headerName: "Email", width: 200 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "contactPhone", headerName: "Phone", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/organizations/${params.row.id}`}
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
        Organizations
        <Link to="/dashboard/organizations/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={organizationList}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
    </div>
  );
};

export default Organization;
