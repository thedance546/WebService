// src/pages/Notification.js
import React, { useState } from 'react';
import Switch from 'react-switch';
import NavBar from "../components/organisms/HomeNavBar";
import navItems from "../constants/navItems";

const Notification = () => {
  const [dateType, setDateType] = useState("유통기한");

  const toggleDateType = () => {
    setDateType((prev) => (prev === "유통기한" ? "소비기한" : "유통기한"));
  };

  const notifications = [
    { id: 1, text: `우유 - ${dateType}이 7일 남았습니다.`, type: "warning", daysLeft: 7 },
    { id: 2, text: `계란 - ${dateType}이 3일 남았습니다.`, type: "danger", daysLeft: 3 },
    { id: 3, text: `치즈 - ${dateType}이 1일 남았습니다.`, type: "danger", daysLeft: 1 },
    { id: 4, text: `사과 - ${dateType}이 지났습니다!`, type: "expired", daysLeft: -1 },
    { id: 5, text: `요거트 - ${dateType}이 5일 남았습니다.`, type: "warning", daysLeft: 5 },
    { id: 6, text: `고기 - ${dateType}이 2일 남았습니다.`, type: "danger", daysLeft: 2 },
    { id: 7, text: `빵 - ${dateType}이 지났습니다!`, type: "expired", daysLeft: -2 },
    { id: 10, text: `토마토 - ${dateType}이 지났습니다!`, type: "expired", daysLeft: -3 },
  ];

  const warningNotifications = notifications.filter(notif => notif.daysLeft > 3 && notif.daysLeft <= 7);
  const dangerNotifications = notifications.filter(notif => notif.daysLeft > 0 && notif.daysLeft <= 3);
  const expiredNotifications = notifications.filter(notif => notif.daysLeft <= 0);

  return (
    <div className="overflow-auto p-3" style={{ height: 'calc(100vh - 10vh)' }}>
      {/* 날짜 타입 토글 스위치 */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-2">
        <label className="d-flex align-items-center" style={{ fontSize: '1.1em' }}>
          유통기한
          <Switch
            checked={dateType === "소비기한"}
            onChange={toggleDateType}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={22}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={26}
            width={48}
            className="mx-2"
          />
          소비기한
        </label>
      </div>

      {/* 7일 이하 알림 */}
      <div className="mb-4">
        <h5 className="mb-3">7일 이하</h5>
        {warningNotifications.map((notif) => (
          <div key={notif.id} className="alert alert-warning">
            {notif.text}
          </div>
        ))}
      </div>
      <hr />

      {/* 3일 이하 알림 */}
      <div className="mb-4">
        <h5 className="mb-3">3일 이하</h5>
        {dangerNotifications.map((notif) => (
          <div key={notif.id} className="alert alert-danger">
            {notif.text}
          </div>
        ))}
      </div>
      <hr />

      {/* 기한 초과 알림 */}
      <div className="mb-4">
        <h5 className="mb-3">기한 초과</h5>
        {expiredNotifications.map((notif) => (
          <div key={notif.id} className="alert alert-dark" style={{ backgroundColor: '#ffdddd', color: '#d9534f' }}>
            {notif.text}
          </div>
        ))}
      </div>

      {/* 네비게이션 바 */}
      <NavBar navItems={navItems} />
    </div>
  );
};

export default Notification;
