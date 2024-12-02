// src/pages/Notification.js
import React from 'react';
import NavBar from "../components/organisms/NavBar";
import navItems from "../constants/navItems";

const Notification = () => {
  const notifications = [
    { id: 1, text: "우유 - 유통기한이 2일 남았습니다.", type: "warning" },
    { id: 2, text: "계란 - 유통기한이 지났습니다!", type: "danger" },
  ];

  return (
    <div className="overflow-auto p-3" style={{ height: 'calc(100vh - 10vh)' }}>
      {notifications.map((notif) => (
        <div key={notif.id} className={`alert alert-${notif.type}`}>
          {notif.text}
        </div>
      ))}
      
      <NavBar navItems={navItems} />
    </div>
  );
};

export default Notification;
