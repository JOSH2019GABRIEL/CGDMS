import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const KPI = ({ title, value }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
    <Typography variant="h5">{value ?? 0}</Typography>
  </Paper>
);

const GlobalKPIs = ({ data = {} }) => (
  <Grid container spacing={2}>
    <Grid item xs={6} md={3}><KPI title="Total Units" value={data.totalUnits} /></Grid>
    <Grid item xs={6} md={3}><KPI title="Total Sales" value={data.totalSales} /></Grid>
    <Grid item xs={6} md={3}><KPI title="Total Commission" value={data.totalCommission} /></Grid>
    <Grid item xs={6} md={3}><KPI title="Commission %" value={data.commissionPercent} /></Grid>
  </Grid>
);

export default GlobalKPIs;
