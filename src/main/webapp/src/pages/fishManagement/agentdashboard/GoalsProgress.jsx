// src/components/Dashboard/GoalsProgress.jsx
import React from "react";

const GoalsProgress = ({ goals = {} }) => {
  const { monthlyTarget = 100000, achieved = 0 } = goals;
  const pct = Math.min(100, Math.round((achieved / monthlyTarget) * 100) || 0);

  return (
    <div className="goalsCard">
      <h4>Monthly Target</h4>
      <div className="progressWrap">
        <div className="progressBar" style={{ width: `${pct}%` }} />
      </div>
      <div className="progressMeta">
        <div>₦{new Intl.NumberFormat().format(achieved)}</div>
        <div>Goal: ₦{new Intl.NumberFormat().format(monthlyTarget)}</div>
      </div>
    </div>
  );
};

export default GoalsProgress;
