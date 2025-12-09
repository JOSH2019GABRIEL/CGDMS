// src/components/Dashboard/NotificationsPanel.jsx
import React from "react";

const NotificationsPanel = ({ items = [] }) => {
  return (
    <div className="notifCard">
      <h4>Notifications</h4>
      <ul>
        {items.length === 0 ? <li className="empty">No notifications</li> :
          items.map((n, i) => <li key={i}><strong>{n.title}</strong><div className="meta">{n.message}</div></li>)
        }
      </ul>
    </div>
  );
};

export default NotificationsPanel;
