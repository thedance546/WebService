// src/components/Profile/Settings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsCommon.css';
import './Settings.css';
import TeamInfo from './TeamInfo';
import PrivacyPolicy from './PrivacyPolicy';
import ContactForm from './ContactForm';
import LogoutButton from './LogoutButton';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogoutSuccess = () => {
    navigate('/'); // 로그아웃 후 Welcome 페이지로 이동
  };

  const handleDeleteAccount = () => {
    // 회원탈퇴 로직을 여기에 구현 예정
    alert('회원탈퇴 기능이 구현될 예정입니다.');
  };

  return (
    <div className="settings-content">
      <h2>설정</h2>
      
      <TeamInfo />
      <PrivacyPolicy />
      <ContactForm />

      <div className="account-actions">
        <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
        <button onClick={handleDeleteAccount} className="delete-account-button">
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default Settings;
