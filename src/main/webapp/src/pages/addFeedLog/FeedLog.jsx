import "../../style/organization.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";

const FeedLog = () => {
  const [feedLogList, setFeedLogList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchFeedLogs = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${baseUrl}feed-logs?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { content, totalElements } = response.data;

      const rows = content.map((feed, index) => ({
        id: feed.id || index,
        ...feed,
      }));

      setFeedLogList(rows);
      setRowCount(totalElements);
    } catch (error) {
      console.error("Error fetching feed logs:", error);
    }
  };

  useEffect(() => {
    fetchFeedLogs(page, pageSize);
  }, [page, pageSize]);

  //TODO:
  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseUrl}batch/archive/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedLogList(feedLogList.filter((feed) => feed.id !== id));
    } catch (error) {
      console.error("Error deleting feedlogs:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "date", headerName: "Date Feed", width: 200 },
    { field: "pondName", headerName: "Pond Name", width: 150 },
    { field: "feedType", headerName: "Feed Type", width: 200 },
    { field: "brand", headerName: "Brand Use", width: 200 },
    { field: "method", headerName: "Method", width: 200 },
    { field: "timeOfDay", headerName: "Time of Day", width: 200 },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/dashboard/feed-log/${params.row.id}`}
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
        Feed Log
        <Link to="/dashboard/feed-log/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={feedLogList}
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

export default FeedLog;
