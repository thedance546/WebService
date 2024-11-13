// LogoutButton.js
import React from 'react';
import { logout } from '../services/Api';

const LogoutButton = ({ accessToken, refreshToken, onLogoutSuccess }) => {
  const handleLogout = async () => {
    try {
      await logout(accessToken, refreshToken); // api.js의 logout 함수 호출
      alert('로그아웃 되었습니다.');
      if (onLogoutSuccess) onLogoutSuccess();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      alert(error.message);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      로그아웃
    </button>
  );
};

export default LogoutButton;
