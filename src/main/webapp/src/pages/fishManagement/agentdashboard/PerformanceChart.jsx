// src/components/Dashboard/PerformanceChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const PerformanceChart = ({ data = [] }) => {
  // data expected: [{date: '2025-12-01', orders: 10, revenue: 12000}, ...]
  return (
    <div className="chartCard">
      <h4>Performance (Last 7 days)</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#1976d2" strokeWidth={2} />
          <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
