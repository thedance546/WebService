// src/components/Settings/Settings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeamInfo from './TeamInfo';
import PrivacyPolicy from './PrivacyPolicy';
import ContactForm from './ContactForm';
import LogoutButton from './LogoutButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogoutSuccess = () => {
    navigate('/'); // 로그아웃 후 Welcome 페이지로 이동
  };

  const handleDeleteAccount = () => {
    alert('회원탈퇴 기능이 구현될 예정입니다.');
  };

  return (
    <div className="container my-4">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">설정</h2>
        
        <TeamInfo />
        <PrivacyPolicy />
        <ContactForm />

        <div className="d-grid gap-2 mt-4">
          <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
          <button onClick={handleDeleteAccount} className="btn btn-danger">
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
