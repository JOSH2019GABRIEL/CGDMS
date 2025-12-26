import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

const TopSkusChart = ({ data = [] }) => {
  // 🔒 Normalize data (prevents invisible bars)
  const safeData = data.map((d) => ({
    sku: d.sku,
    units: Number(d.totalUnits) || 0,
  }));

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 2 }}
      >
        Top SKUs
      </Typography>

      {/* 🔒 Fixed height container */}
      <Box sx={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={safeData}
            margin={{ top: 30, right: 20, left: 20, bottom: 40 }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="sku"
              tick={{ fontSize: 12, fill: "#374151" }}
              axisLine={{ stroke: "#d1d5db" }}
              tickLine={false}
            />

            {/* 🔒 Force Y-axis range */}
            <YAxis
              allowDecimals={false}
              domain={[0, "dataMax + 10"]}
              tick={{ fontSize: 12, fill: "#374151" }}
              axisLine={{ stroke: "#d1d5db" }}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(25,118,210,0.1)" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            />

            {/* 🔒 Bar with background */}
            <Bar
              dataKey="units"
              fill="#1976d2"
              barSize={42}
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}  // 🔴 critical
              background={{ fill: "#e5e7eb" }} // 🔴 makes bars visible always
            >
              {/* 🔒 Value on bar */}
              <LabelList
                dataKey="units"
                position="top"
                fill="#111827"
                fontSize={13}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TopSkusChart;
