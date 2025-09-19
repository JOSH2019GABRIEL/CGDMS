import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";

const Farm = () => {
  const [FarmList, setFarmList] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch Farms
  const fetchFarms = async () => {
    try {
      const response = await axios.get(`${baseUrl}farms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rows = response.data.map((org, index) => ({
        id: org.id || index, 
        ...org,
      }));

      setFarmList(rows);
    } catch (error) {
      console.error("Error fetching farm:", error);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}farm/archive/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("action Hit ", `${id}`)
      setFarmList(FarmList.filter((org) => org.id !== id));
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "farmName", headerName: "Name", width: 200 },
    { field: "location", headerName: "Location", width: 200 },
    { field: "organizationName", headerName: "Organization Name", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/farm/${params.row.id}`}
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
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Farms
        <Link to="/dashboard/farm/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={FarmList}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
    </div>
  );
};

export default Farm;
