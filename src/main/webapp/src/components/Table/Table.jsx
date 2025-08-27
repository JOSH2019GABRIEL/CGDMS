import "./table.scss"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const List = () => {

  const rows = [
    {
      id: 12244,
      product: "Acer Nitro 5",
      customer: "Joseph Akeh",
      date: "1 March",
      amount: 788,
      method: "Cash on Delivery",
      status: "Approved",
    },
    {
      id: 12244,
      product: "Acer Nitro 5",
      customer: "Joseph Akeh",
      date: "1 March",
      amount: 788,
      method: "Cash on Delivery",
      status: "Approved",
    },
    {
      id: 12244,
      product: "Acer Nitro 5",
      customer: "Joseph Akeh",
      date: "1 March",
      amount: 788,
      method: "Cash on Delivery",
      status: "Pending",
    },
  ];

  return (
          <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell" align="right">Product</TableCell>
            <TableCell className="tableCell" align="right">Customer_Name</TableCell>
            <TableCell className="tableCell" align="right">Date</TableCell>
            <TableCell className="tableCell" align="right">Amount</TableCell>
            <TableCell className="tableCell" align="right">Method</TableCell>
            <TableCell className="tableCell" align="right">Status</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell className="tableCell" align="right">{row.product}</TableCell>
              <TableCell className="tableCell" align="right">{row.customer}</TableCell>
              <TableCell className="tableCell" align="right">{row.date}</TableCell>
              <TableCell className="tableCell" align="right">{row.amount}</TableCell>
              <TableCell className="tableCell" align="right">{row.method}</TableCell>
              <TableCell className="tableCell" align="right">
                <span className={`status ${row.status}`}>{row.status}</span>
                </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>


  )
}

export default List