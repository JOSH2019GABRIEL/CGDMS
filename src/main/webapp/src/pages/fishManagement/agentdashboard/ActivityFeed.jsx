// src/components/Dashboard/ActivityFeed.jsx
import React from "react";

const ActivityFeed = ({ items = [] }) => {
  return (
    <div className="feedCard">
      <h4>Activity</h4>
      <ul className="feedList">
        {items.length === 0 ? (
          <li className="empty">No activity yet</li>
        ) : (
          items.map((it, i) => (
            <li key={i}>
              <div className="feedTitle">{it.title || it.type}</div>
              <div className="feedMeta">{it.desc || it.message} · {new Date(it.time).toLocaleString()}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ActivityFeed;
