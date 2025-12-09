// src/components/Dashboard/RecentOrdersTable.jsx
import React from "react";

const RecentOrdersTable = ({ rows = [], reload = () => {} }) => {
  const fmt = (n) => new Intl.NumberFormat().format(n ?? 0);

  return (
    <div className="tableCard">
      <div className="tableHeader">
        <h4>Recent Orders</h4>
        <button className="smallBtn" onClick={reload}>Refresh</button>
      </div>
      <table className="recentTable">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={5} className="empty">No recent orders</td></tr>
          ) : (
            rows.map((r) => (
              <tr key={r.orderId || r.id}>
                <td>{r.orderId}</td>
                <td>{r.customer}</td>
                <td>{r.units ?? r.itemsCount ?? "-"}</td>
                <td>₦{fmt(r.amount)}</td>
                <td>{new Date(r.date).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;
