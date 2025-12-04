import React from "react";
import { Grid, Paper, Typography, Box, Skeleton } from "@mui/material";

const KPI = ({ title, value, loading }) => {
  const formatValue = () => {
    // Handle null/undefined values
    if (value === null || value === undefined) {
      return "0";
    }

    // Check if this is a monetary value
    const isMonetary = title.includes('Sales') || 
                       title.includes('Commission') || 
                       title.includes('Avg');

    if (isMonetary && typeof value === 'number') {
      return `₦${value.toLocaleString('en-NG', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }

    // For non-monetary numbers
    if (typeof value === 'number') {
      return value.toLocaleString('en-NG');
    }

    return value;
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="textSecondary">
        {title}
      </Typography>
      <Box mt={1}>
        {loading ? (
          <Skeleton variant="text" width="60%" height={40} />
        ) : (
          <Typography variant="h5">
            {formatValue()}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const KPICards = ({ data, loading }) => {
  const s = data || { 
    totalOrders: 0, 
    totalUnits: 0, 
    totalSales: 0, 
    totalCommission: 0, 
    averageValue: 0 
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={2.4}>
        <KPI title="Total Orders" value={s.totalOrders} loading={loading} />
      </Grid>
      <Grid item xs={6} md={2.4}>
        <KPI title="Units Sold" value={s.totalUnits} loading={loading} />
      </Grid>
      <Grid item xs={6} md={2.4}>
        <KPI title="Total Sales" value={s.totalSales} loading={loading} />
      </Grid>
      <Grid item xs={6} md={2.4}>
        <KPI title="Total Commission" value={s.totalCommission} loading={loading} />
      </Grid>
      <Grid item xs={6} md={2.4}>
        <KPI title="Avg Order" value={s.averageValue} loading={loading} />
      </Grid>
    </Grid>
  );
};

export default KPICards;