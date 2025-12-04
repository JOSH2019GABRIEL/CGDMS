import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import GlobalFilters from "./GlobalFilters";
import TrendChart from "./TrendChart";
import AgentLeaderboard from "./AgentLeaderboard";
import KPICards from "./GlobalKPIs";

import { fetchGlobalReport, exportGlobalReport } from "../common/api";

const GlobalReport = () => {
  const [filters, setFilters] = useState({
    start: null,
    end: null,
    region: null,
  });

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchGlobalReport(filters);
      setReport(res.data);
    } catch (err) {
      console.error("Global report load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleExport = async () => {
    try {
      const resp = await exportGlobalReport(filters);
      const blob = new Blob([resp.data], {
        type: resp.headers["content-type"],
      });

      const fileName =
        resp.headers["content-disposition"]?.split("filename=")[1] ||
        "global-report.xlsx";

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName.replace(/"/g, "");
      link.click();
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={2}>
        {/* FILTERS */}
        <GlobalFilters filters={filters} setFilters={setFilters} onFilter={load} />

        {/* KPI SUMMARY */}
        <Box mt={2}>
          <KPICards data={report?.summary} loading={loading} />
        </Box>

        {/* MAIN CONTENT */}
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={8}>
            <TrendChart data={report?.trend || []} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AgentLeaderboard rows={report?.byAgent || []} />
          </Grid>
        </Grid>

        {/* EXPORT */}
        <Box mt={3}>
          <Button variant="contained" onClick={handleExport}>
            Export Global Excel
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default GlobalReport;
