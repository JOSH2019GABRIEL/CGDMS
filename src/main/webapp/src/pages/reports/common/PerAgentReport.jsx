import React, { useState, useCallback, useEffect } from "react";
import { Box, Grid, Paper, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";

import PerAgentFilters from "./PerAgentFilters";
import KPICards from "./KPICards";
import TopSkusChart from "./TopSkusChart";
import OrdersTable from "./OrdersTable";
import { fetchPerAgentReport, exportPerAgentReport } from "./api";

import "./peragentreport.scss";

const PerAgentReport = () => {
  const token = localStorage.getItem("token");


  const [filters, setFilters] = useState({
    start: "",
    end: "",
    agentId: "",
    status: "",
    page: 0,
    size: 10,
  });

  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState({
    summary: null,
    topSkus: [],
    orders: [],
    totalCount: 0,
  });

  const loadReport = useCallback(async () => {
    if (!filters.start || !filters.end) {
      alert("Please select both start and end dates");
      return;
    }

    setLoading(true);

    try {
      const response = await fetchPerAgentReport(filters, token);

      const { content, totalElements } = response.data;

      const reportData = content?.[0] || {};

     // Update UI
      setReport({
        summary: reportData.summary || null,
        topSkus: reportData.topSkus || [],
        orders: reportData.orders || [],
        totalCount: totalElements || 0,
      });
    } catch (error) {
      console.error("Error loading report:", error);
      console.error("Error response:", error?.response);

    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  const handleExport = async () => {
    if (!filters.start || !filters.end) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      const resp = await exportPerAgentReport(filters, token);
      const blob = new Blob([resp.data], {
        type: resp.headers["content-type"],
      });

      const filename =
        resp.headers["content-disposition"]?.split("filename=")[1] ||
        "per-agent-report.xlsx";

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename.replace(/"/g, "");
      link.click();
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Failed to export report. Please try again.");
    }
  };

  return (
    <div className="home">
      <Sidebar />

      <div className="homeContainer">
        <Navbar />

        <div className="content">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box p={2}>
              <PerAgentFilters
                filters={filters}
                setFilters={setFilters}
                onGenerate={loadReport}
                loading={loading}
              />

              <Box mt={2}>
                <KPICards data={report.summary} loading={loading} />
              </Box>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={8}>
                  <TopSkusChart data={report.topSkus} />

                  <Box mt={2}>
                    <OrdersTable
                      rows={report.orders}
                      totalCount={report.totalCount}
                      filters={filters}
                      setFilters={setFilters}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <h3>Export Report</h3>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleExport}
                      disabled={!filters.start || !filters.end}
                    >
                      Download Excel
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};

export default PerAgentReport;
