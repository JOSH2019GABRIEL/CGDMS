import React from "react";
import { 
  Paper, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  TablePagination,
  Typography 
} from "@mui/material";

const OrdersTable = ({ rows = [], totalCount = 0, filters, setFilters }) => {
  const handleChangePage = (event, newPage) => {
    setFilters((f) => ({ ...f, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setFilters((f) => ({ 
      ...f, 
      size: parseInt(event.target.value, 10),
      page: 0 
    }));
  };

  return (
    <Paper sx={{ mt: 2, p: 1 }}>
      <Typography variant="h6" sx={{ p: 1 }}>Orders</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell align="right">Units</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Commission</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No orders found. Click "Generate" to load data.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r, index) => (
              <TableRow key={r.orderId || index}>
                <TableCell>{r.orderId}</TableCell>
                <TableCell>{r.customer}</TableCell>
                <TableCell align="right">{r.units || 0}</TableCell>
                <TableCell align="right">
                  ₦{(r.amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  ₦{(r.commission || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  {r.date ? new Date(r.date).toLocaleDateString('en-NG') : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalCount}
        page={filters.page}
        onPageChange={handleChangePage}
        rowsPerPage={filters.size}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
};

export default OrdersTable;