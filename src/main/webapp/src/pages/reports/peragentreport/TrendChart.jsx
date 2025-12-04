import React from "react";
import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const TrendChart = ({ data = [] }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">Revenue Trend</Typography>
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Paper>
);

export default TrendChart;
