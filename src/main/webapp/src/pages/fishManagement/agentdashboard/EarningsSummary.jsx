// src/components/Dashboard/EarningsSummary.jsx
import React from "react";

const EarningsSummary = ({ earnings = {} }) => {
  const { revenue = 0, commissions = 0, totalEarningInCurrentMonth = 0 } = earnings;
  const fmt = (n) => new Intl.NumberFormat().format(n ?? 0);

  return (
    <div className="earningsSummary">
      <div className="earnCard">
        <div className="label">Total Revenue</div>
        <div className="value">₦{fmt(revenue)}</div>
      </div>
      <div className="earnCard">
        <div className="label"> Total Commissions</div>
        <div className="value">₦{fmt(commissions)}</div>
      </div>
      <div className="earnCard">
        <div className="label">Current Commisisions</div>
        <div className="value">₦{fmt(totalEarningInCurrentMonth)}</div>
      </div>
    </div>
  );
};

export default EarningsSummary;
