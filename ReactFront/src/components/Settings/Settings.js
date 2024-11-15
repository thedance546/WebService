// src/components/Settings/Settings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeamInfo from './TeamInfo';
import PrivacyPolicy from './PrivacyPolicy';
import ContactForm from './ContactForm';
import LogoutButton from './LogoutButton';
import DeleteAccountButton from './DeleteAccountButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogoutSuccess = () => {
    navigate('/'); // 로그아웃 후 Welcome 페이지로 이동
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
          <DeleteAccountButton onAccountDeleted={handleLogoutSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
