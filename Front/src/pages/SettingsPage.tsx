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
        </div>
        <div className="d-grid gap-2 mt-4">
          <TeamInfo />
          <LogoutButton />
          <DeleteAccountButton />
        </div>
      </div>

      <HomeNavBar />
    </div>
  );
};

export default SettingsPage;
