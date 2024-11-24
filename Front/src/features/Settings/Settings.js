// src/features/Settings/Settings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import DeleteAccountButton from './DeleteAccountButton';
import TeamInfo from './TeamInfo';
import PrivacyPolicy from './PrivacyPolicy';
import ContactForm from './ContactForm';
import ThemeSelector from './ThemeSelector';

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
    </div>
  );
};

export default Settings;
