import { useEffect, useState } from "react";
import axios from "axios";
import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import { url as baseUrl } from "../../api";

const List = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
   const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFishPerformance = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}fish-performance?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { content, totalElements } = response.data;

        const mappedRows = content.map((perf, index) => ({
          id: perf.id || `${page}-${index}`, 
          ...perf,
        }));

        setRows(mappedRows);
        setTotalElements(totalElements);
      } catch (error) {
        console.error("Error fetching fish performance:", error);
        toast.error("Could not load fish performance data here");
      }
    };

    fetchFishPerformance();
  }, [page, pageSize, baseUrl, token]);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="fish performance table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell">Pond</TableCell>
            <TableCell className="tableCell">Species</TableCell>
            <TableCell className="tableCell">Average Weight</TableCell>
            <TableCell className="tableCell">Growth Rate</TableCell>
            <TableCell className="tableCell">Survival Rate</TableCell>
            <TableCell className="tableCell">Date Recorded</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">{row.pondName}</TableCell>
              <TableCell className="tableCell">{row.species}</TableCell>
              <TableCell className="tableCell">{row.avgWeightG} g</TableCell>
              <TableCell className="tableCell">{row.growthRate} %</TableCell>
              <TableCell className="tableCell">{row.liveCount} %</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;