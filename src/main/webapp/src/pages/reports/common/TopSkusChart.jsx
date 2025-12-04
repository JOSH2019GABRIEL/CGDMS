import React from "react";
import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const TopSkusChart = ({ data = [] }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">Top SKUs</Typography>
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="sku" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="units" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Paper>
);

export default TopSkusChart;
