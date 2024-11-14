// src/components/Notification/Notification.js

import React from 'react';
import './Notification.css';

const Notification = () => {
  const notifications = [
    { id: 1, text: "우유 - 유통기한이 2일 남았습니다.", type: "warning" },
    { id: 2, text: "계란 - 유통기한이 지났습니다!", type: "danger" },
  ];

  return (
    <div className="notification-container">
      {notifications.map(notif => (
        <div key={notif.id} className={`notification ${notif.type}`}>
          {notif.text}
        </div>
      ))}
    </div>
  );
};

export default Notification;
