// src/components/Settings/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onLogoutSuccess }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리 로직
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    alert('로그아웃 되었습니다.');
    
    // 성공 시 콜백 호출
    if (onLogoutSuccess) onLogoutSuccess();
    
    // Welcome 페이지로 이동
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      로그아웃
    </button>
  );
};

export default LogoutButton;
