// src/components/Profile/Settings.js
import React from 'react';
import './SettingsCommon.css';
import './Settings.css';
import TeamInfo from './TeamInfo';
import PrivacyPolicy from './PrivacyPolicy';
import ContactForm from './ContactForm';

const Settings = () => {
  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
  };

  const handleDeleteAccount = () => {
    alert('회원탈퇴 되었습니다.');
  };

  return (
    <div className="settings-content">
      <h2>설정</h2>
      
      <TeamInfo />
      <PrivacyPolicy />
      <ContactForm />

      <div className="account-actions">
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
        <button onClick={handleDeleteAccount} className="delete-account-button">회원탈퇴</button>
      </div>
    </div>
  );
};

export default Settings;
