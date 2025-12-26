import React, { forwardRef } from "react";
import MaterialTable from "@material-table/core";
import { Paper, Typography, Box, Button, Stack } from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import AddBox from "@mui/icons-material/AddBox";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import Check from "@mui/icons-material/Check";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Clear from "@mui/icons-material/Clear";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Remove from "@mui/icons-material/Remove";
import Search from "@mui/icons-material/Search";
import ViewColumn from "@mui/icons-material/ViewColumn";
import SaveAlt from "@mui/icons-material/SaveAlt";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

/* ---------------- EXPORT HELPERS ---------------- */

const formatExportData = (rows) =>
  rows.map((row) => ({
    "Order ID": row.orderId,
    Customer: row.customer,
    Units: row.units ?? 0,
    Amount: row.amount ?? 0,
    Commission: row.commission ?? 0,
    Date: row.date
      ? new Date(row.date).toLocaleDateString("en-NG")
      : "",
  }));

const exportCSV = (rows) => {
  if (!rows.length) return;

  const headers = Object.keys(formatExportData(rows)[0]);
  const csvRows = [
    headers.join(","),
    ...formatExportData(rows).map((row) =>
      headers.map((h) => `"${row[h]}"`).join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "orders-report.csv");
};

const exportExcel = (rows) => {
  if (!rows.length) return;

  const worksheet = XLSX.utils.json_to_sheet(formatExportData(rows));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "orders-report.xlsx");
};

/* ---------------- COMPONENT ---------------- */

const OrdersTable = ({
  rows = [],
  totalCount = 0,
  filters,
  setFilters,
  loading,
}) => {
  return (
    <Paper sx={{ mt: 3 }}>
      <MaterialTable
        icons={tableIcons}
        title={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Orders Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and export order records
              </Typography>
            </Box>

            {/* EXPLICIT EXPORT BUTTONS */}
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<SaveAlt />}
                onClick={() => exportCSV(rows)}
              >
                Export CSV
              </Button>

              <Button
                size="small"
                variant="contained"
                startIcon={<SaveAlt />}
                onClick={() => exportExcel(rows)}
              >
                Export Excel
              </Button>
            </Stack>
          </Box>
        }
        columns={[
          { title: "Order ID", field: "orderId" },
          { title: "Customer", field: "customer" },
          {
            title: "Units",
            field: "units",
            type: "numeric",
            render: (row) => row.units ?? 0,
          },
          {
            title: "Amount (₦)",
            field: "amount",
            render: (row) =>
              `₦${(row.amount || 0).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}`,
          },
          {
            title: "Commission (₦)",
            field: "commission",
            render: (row) =>
              `₦${(row.commission || 0).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}`,
          },
          {
            title: "Date",
            field: "date",
            render: (row) =>
              row.date
                ? new Date(row.date).toLocaleDateString("en-NG")
                : "-",
          },
        ]}
        data={rows}
        isLoading={loading}
        options={{
          paging: true,
          pageSize: filters.size,
          pageSizeOptions: [5, 10, 25, 50],
          search: false,
          filtering: false,
          sorting: false,
          toolbar: true,
          headerStyle: {
            backgroundColor: "#014d88",
            color: "#fff",
            fontWeight: "bold",
          },
        }}
        page={filters.page}
        totalCount={totalCount}
        onChangePage={(page) =>
          setFilters((f) => ({
            ...f,
            page,
          }))
        }
        onChangeRowsPerPage={(pageSize) =>
          setFilters((f) => ({
            ...f,
            size: pageSize,
            page: 0,
          }))
        }
        localization={{
          body: {
            emptyDataSourceMessage:
              "No orders found. Click Generate to load data.",
          },
        }}
      />
    </Paper>
  );
};

export default OrdersTable;
