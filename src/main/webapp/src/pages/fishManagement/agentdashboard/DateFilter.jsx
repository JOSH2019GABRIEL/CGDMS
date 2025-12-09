// src/components/Dashboard/DateFilter.jsx
import React from "react";

const DateFilter = ({ filters, setFilters }) => {
  return (
    <div className="dateFilter">
      <input
        type="date"
        value={filters.start || ""}
        onChange={(e) => setFilters(f => ({ ...f, start: e.target.value }))}
      />
      <span className="dash">—</span>
      <input
        type="date"
        value={filters.end || ""}
        onChange={(e) => setFilters(f => ({ ...f, end: e.target.value }))}
      />
    </div>
  );
};

export default DateFilter;
