// src/components/Dashboard/KpiCard.jsx
import React from "react";

const KpiCard = ({ title, value , color = "blue", loading }) => {
  return (
    <div className={`kpiCard ${color}`}>
      <div className="kpiTitle">{title}</div>
      <div className="kpiValue">{loading ? "..." : value}</div>
    </div>
  );
};

export default KpiCard;
