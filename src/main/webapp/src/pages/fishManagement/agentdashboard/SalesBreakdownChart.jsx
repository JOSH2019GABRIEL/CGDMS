// src/components/Dashboard/SalesBreakdownChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#1976d2", "#4caf50", "#ff9800", "#f44336", "#9c27b0"];

const SalesBreakdownChart = ({ data = [] }) => {
  // data expected: [{ sku: 'CatFish', value: 12000 }, ...]
  return (
    <div className="chartCard">
      <h4>Top SKUs</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="sku"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesBreakdownChart;
