// src/components/Settings/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onLogoutSuccess }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    alert('로그아웃 되었습니다.');

    if (onLogoutSuccess) onLogoutSuccess();
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="btn btn-warning w-100">
      로그아웃
    </button>
  );
};

export default LogoutButton;
