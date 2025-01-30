// src/pages/SettingsPage.tsx

import React from 'react';
import CommonHeader from "../components/organisms/CommonHeader";
import TeamInfo from '../features/Settings/TeamInfo';
import PrivacyPolicy from '../features/Settings/PrivacyPolicy';
import ContactForm from '../features/Settings/ContactForm';
import LogoutButton from '../components/molecules/LogoutButton';
import DeleteAccountButton from '../components/molecules/DeleteAccountButton';
import HomeNavBar from "../components/organisms/HomeNavBar";

const SettingsPage: React.FC = () => {
  return (
    <div className="container">
      <CommonHeader pageTitle="설정" />
      <div style={{ height: 'var(--top-margin)' }}></div>

      <div className="card p-4 shadow-sm">
        <div className="accordion" id="settingsAccordion">
          <PrivacyPolicy />
          <ContactForm />
          <TeamInfo />
        </div>
        <div className="d-grid gap-2 mt-4">
          <LogoutButton style={{
            width: '45%', margin: '0 auto',
            backgroundColor: 'var(--button-warning-color)',
          }} />
          <DeleteAccountButton style={{
            width: '45%', margin: '0 auto',
            backgroundColor: 'var(--button-danger-color)',
          }} />
        </div>
      </div>

      <HomeNavBar />
    </div>
  );
};

export default SettingsPage;
