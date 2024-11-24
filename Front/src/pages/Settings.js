// src/pages/Settings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../features/Settings/LogoutButton';
import DeleteAccountButton from '../features/Settings/DeleteAccountButton';
import TeamInfo from '../features/Settings/TeamInfo';
import PrivacyPolicy from '../features/Settings/PrivacyPolicy';
import ContactForm from '../features/Settings/ContactForm';
import ThemeSelector from '../features/Settings/ThemeSelector';
import NavBar from '../components/UI/NavBar';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogoutSuccess = () => {
    navigate('/');
  };

  return (
    <div className="settings-container">
      <div style={{ height: 'var(--top-margin)' }}></div>

      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">설정</h2>

        <div className="accordion" id="settingsAccordion">
          <PrivacyPolicy />
          <ContactForm />
          <ThemeSelector />
        </div>

        <div className="d-grid gap-2 mt-4">
          <TeamInfo />
          <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
          <DeleteAccountButton onAccountDeleted={handleLogoutSuccess} />
        </div>
      </div>
      
      <NavBar />
    </div>
  );
};

export default Settings;
